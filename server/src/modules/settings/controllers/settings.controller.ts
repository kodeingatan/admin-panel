import { Controller, Get, Put, Body, Param, Post, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync } from 'fs';
import { SettingsService } from '@/modules/settings/services/settings.service';
import { UpdateSettingDto } from '@/modules/settings/dto/update-setting.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const UPLOAD_DIR = join(process.cwd(), 'uploads');

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Get('uploads/:filename')
  serveFile(@Param('filename') filename: string, @Res() res: any) {
    const filePath = join(UPLOAD_DIR, filename);
    if (!existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }
    return res.sendFile(filePath);
  }

  @Get(':key')
  findByKey(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Put()
  @Permissions('Settings', 'Full Access')
  @Roles('Admin', 'Super Admin')
  bulkUpdate(@Body() body: { settings: UpdateSettingDto[] }) {
    return this.settingsService.bulkUpdate(body.settings);
  }

  @Post('upload')
  @Permissions('Settings', 'Full Access')
  @Roles('Admin', 'Super Admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `settings-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG');
    }
    return { url: `/api/settings/uploads/${file.filename}` };
  }
}
