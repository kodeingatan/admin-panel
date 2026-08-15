import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { RolesModule } from '@/modules/roles/roles.module';
import { PermissionsModule } from '@/modules/permissions/permissions.module';
import { GuardsModule } from '@/modules/guards/guards.module';
import { ActivityLogsModule } from '@/modules/activity-logs/activity-logs.module';
import { SystemLogsModule } from '@/modules/system-logs/system-logs.module';
import { User } from '@/modules/users/entities/user.entity';
import { Role } from '@/modules/roles/entities/role.entity';
import { Permission } from '@/modules/permissions/entities/permission.entity';
import { PermissionMethod } from '@/modules/permissions/entities/permission-method.entity';
import { PermissionUrl } from '@/modules/permissions/entities/permission-url.entity';
import { Guard } from '@/modules/guards/entities/guard.entity';
import { GuardUrl } from '@/modules/guards/entities/guard-url.entity';
import { ActivityLog } from '@/modules/activity-logs/entities/activity-log.entity';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { SeederService } from '@/common/services/seeder.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RbacGuard } from '@/common/guards/rbac.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'db.sqlite',
      entities: [
        User,
        Role,
        Permission,
        PermissionMethod,
        PermissionUrl,
        Guard,
        GuardUrl,
        ActivityLog,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      PermissionMethod,
      PermissionUrl,
      Guard,
      GuardUrl,
    ]),
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    GuardsModule,
    ActivityLogsModule,
    SystemLogsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SeederService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RbacGuard },
  ],
})
export class AppModule {}
