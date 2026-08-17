import { Module } from '@nestjs/common';
import { StorageController } from '@/modules/storage/controllers/storage.controller';
import { StorageService } from '@/modules/storage/services/storage.service';

@Module({
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
