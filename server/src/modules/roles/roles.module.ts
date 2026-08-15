import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '@/modules/roles/entities/role.entity';
import { Guard } from '@/modules/guards/entities/guard.entity';
import { Permission } from '@/modules/permissions/entities/permission.entity';
import { RolesController } from '@/modules/roles/controllers/roles.controller';
import { RolesService } from '@/modules/roles/services/roles.service';
import { ActivityLogsModule } from '@/modules/activity-logs/activity-logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, Guard, Permission]),
    ActivityLogsModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
