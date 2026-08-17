import { Controller, Get, Put, Body, Param, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { SettingsService } from '@/modules/settings/services/settings.service';
import { StorageService } from '@/modules/storage/services/storage.service';
import { UpdateSettingDto } from '@/modules/settings/dto/update-setting.dto';
import { Public } from '@/common/decorators/public.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { Permissions } from '@/common/decorators/permissions.decorator';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly storageService: StorageService,
  ) {}

  @Public()
  @Get()
  findAll() {
    return this.settingsService.findAll();
  }

  @Public()
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
      storage: memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Allowed: JPEG, PNG, GIF, WebP, SVG');
    }
    const url = this.storageService.uploadFile(file, 'settings');
    return { url };
  }
}
