import { Injectable, BadRequestException } from '@nestjs/common';
import { extname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';

const STORAGE_ROOT = join(process.cwd(), 'storage');
const ALLOWED_SUBFOLDERS = ['settings', 'avatars', 'general'];

@Injectable()
export class StorageService {
  private ensureSubfolder(subfolder: string): void {
    if (!ALLOWED_SUBFOLDERS.includes(subfolder)) {
      throw new BadRequestException(`Invalid subfolder: ${subfolder}`);
    }
    const dir = join(STORAGE_ROOT, subfolder);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  uploadFile(file: Express.Multer.File, subfolder: string): string {
    this.ensureSubfolder(subfolder);

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const filename = `upload-${uniqueSuffix}${ext}`;
    const filePath = join(STORAGE_ROOT, subfolder, filename);

    writeFileSync(filePath, file.buffer);

    return `/api/storage/${subfolder}/${filename}`;
  }

  getFilePath(filename: string, subfolder: string): string {
    this.ensureSubfolder(subfolder);
    return join(STORAGE_ROOT, subfolder, filename);
  }

  deleteFile(filename: string, subfolder: string): void {
    this.ensureSubfolder(subfolder);
    const filePath = join(STORAGE_ROOT, subfolder, filename);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }
}
