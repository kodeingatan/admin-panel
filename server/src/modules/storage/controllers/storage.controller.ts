import {
  Controller,
  Get,
  Param,
  Res,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { join, extname } from 'path';
import { existsSync } from 'fs';
import { Public } from '@/common/decorators/public.decorator';
import { StorageService } from '@/modules/storage/services/storage.service';

const ALLOWED_SUBFOLDERS = ['settings', 'avatars', 'general'];

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Public()
  @Get(':subfolder/:filename')
  serveFile(
    @Param('subfolder') subfolder: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    if (!ALLOWED_SUBFOLDERS.includes(subfolder)) {
      throw new BadRequestException(`Invalid subfolder: ${subfolder}`);
    }

    if (filename.includes('..') || filename.includes('/')) {
      throw new BadRequestException('Invalid filename');
    }

    const filePath = this.storageService.getFilePath(filename, subfolder);

    if (!existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    const ext = extname(filename).toLowerCase();
    const contentType = MIME_TYPES[ext] ?? 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.sendFile(filePath);
  }
}
