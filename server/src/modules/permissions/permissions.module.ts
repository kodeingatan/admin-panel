import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '@/modules/permissions/entities/permission.entity';
import { PermissionMethod } from '@/modules/permissions/entities/permission-method.entity';
import { PermissionUrl } from '@/modules/permissions/entities/permission-url.entity';
import { PermissionsController } from '@/modules/permissions/controllers/permissions.controller';
import { PermissionsService } from '@/modules/permissions/services/permissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, PermissionMethod, PermissionUrl])],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
