import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@/modules/users/entities/user.entity';
import { Role } from '@/modules/roles/entities/role.entity';
import { Permission } from '@/modules/permissions/entities/permission.entity';
import { PermissionMethod } from '@/modules/permissions/entities/permission-method.entity';
import { PermissionUrl } from '@/modules/permissions/entities/permission-url.entity';
import { Guard } from '@/modules/guards/entities/guard.entity';
import { GuardUrl } from '@/modules/guards/entities/guard-url.entity';
import { Setting } from '@/modules/settings/entities/setting.entity';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    @InjectRepository(Permission)
    private permissionsRepo: Repository<Permission>,
    @InjectRepository(PermissionMethod)
    private permissionMethodsRepo: Repository<PermissionMethod>,
    @InjectRepository(PermissionUrl)
    private permissionUrlsRepo: Repository<PermissionUrl>,
    @InjectRepository(Guard) private guardsRepo: Repository<Guard>,
    @InjectRepository(GuardUrl) private guardUrlsRepo: Repository<GuardUrl>,
    @InjectRepository(Setting) private settingsRepo: Repository<Setting>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const userCount = await this.usersRepo.count();
    const guardCount = await this.guardsRepo.count();
    const permissionCount = await this.permissionsRepo.count();
    const roleCount = await this.rolesRepo.count();

    if (userCount > 0 || guardCount > 0 || permissionCount > 0 || roleCount > 0) {
      this.logger.log('Database already seeded, skipping...');
      return;
    }

    this.logger.log('Seeding database...');

    const guards = await this.seedGuards();
    const permissions = await this.seedPermissions();
    const roles = await this.seedRoles(guards, permissions);
    await this.seedUsers(roles);
    await this.seedSettings();

    this.logger.log('Database seeded successfully');
  }

  private async seedGuards(): Promise<Guard[]> {
    const fullAccess = this.guardsRepo.create({
      guardName: 'Full Access',
      description: 'Izinkan semua URL',
    });
    await this.guardsRepo.save(fullAccess);
    await this.guardUrlsRepo.save(
      this.guardUrlsRepo.create({
        url: '/*',
        type: 'allow',
        guard: fullAccess,
      }),
    );

    const webAccess = this.guardsRepo.create({
      guardName: 'Web Access',
      description: 'Hanya akses API, tolak admin routes',
    });
    await this.guardsRepo.save(webAccess);
    await this.guardUrlsRepo.save([
      this.guardUrlsRepo.create({
        url: '/api/*',
        type: 'allow',
        guard: webAccess,
      }),
      this.guardUrlsRepo.create({
        url: '/api/admin/*',
        type: 'deny',
        guard: webAccess,
      }),
    ]);

    const apiOnly = this.guardsRepo.create({
      guardName: 'API Only',
      description: 'Hanya akses API endpoints',
    });
    await this.guardsRepo.save(apiOnly);
    await this.guardUrlsRepo.save(
      this.guardUrlsRepo.create({
        url: '/api/*',
        type: 'allow',
        guard: apiOnly,
      }),
    );

    const adminOnly = this.guardsRepo.create({
      guardName: 'Admin Only',
      description: 'Hanya akses admin dan user management',
    });
    await this.guardsRepo.save(adminOnly);
    await this.guardUrlsRepo.save([
      this.guardUrlsRepo.create({
        url: '/api/admin/*',
        type: 'allow',
        guard: adminOnly,
      }),
      this.guardUrlsRepo.create({
        url: '/api/users/*',
        type: 'allow',
        guard: adminOnly,
      }),
      this.guardUrlsRepo.create({
        url: '/api/roles/*',
        type: 'allow',
        guard: adminOnly,
      }),
    ]);

    const readOnlyGuard = this.guardsRepo.create({
      guardName: 'Read Only Guard',
      description: 'Akses baca saja, tolak user dan role management',
    });
    await this.guardsRepo.save(readOnlyGuard);
    await this.guardUrlsRepo.save([
      this.guardUrlsRepo.create({
        url: '/api/*',
        type: 'allow',
        guard: readOnlyGuard,
      }),
      this.guardUrlsRepo.create({
        url: '/api/users',
        type: 'deny',
        guard: readOnlyGuard,
      }),
      this.guardUrlsRepo.create({
        url: '/api/roles',
        type: 'deny',
        guard: readOnlyGuard,
      }),
    ]);

    const userMgmtGuard = this.guardsRepo.create({
      guardName: 'User Management Guard',
      description: 'Hanya akses user management',
    });
    await this.guardsRepo.save(userMgmtGuard);
    await this.guardUrlsRepo.save(
      this.guardUrlsRepo.create({
        url: '/api/users/*',
        type: 'allow',
        guard: userMgmtGuard,
      }),
    );

    const roleMgmtGuard = this.guardsRepo.create({
      guardName: 'Role Management Guard',
      description: 'Hanya akses role management',
    });
    await this.guardsRepo.save(roleMgmtGuard);
    await this.guardUrlsRepo.save(
      this.guardUrlsRepo.create({
        url: '/api/roles/*',
        type: 'allow',
        guard: roleMgmtGuard,
      }),
    );

    const dashboardOnly = this.guardsRepo.create({
      guardName: 'Dashboard Only',
      description: 'Hanya akses profile, tolak semua management',
    });
    await this.guardsRepo.save(dashboardOnly);
    await this.guardUrlsRepo.save([
      this.guardUrlsRepo.create({
        url: '/api/auth/profile',
        type: 'allow',
        guard: dashboardOnly,
      }),
      this.guardUrlsRepo.create({
        url: '/api/users/*',
        type: 'deny',
        guard: dashboardOnly,
      }),
      this.guardUrlsRepo.create({
        url: '/api/roles/*',
        type: 'deny',
        guard: dashboardOnly,
      }),
      this.guardUrlsRepo.create({
        url: '/api/permissions/*',
        type: 'deny',
        guard: dashboardOnly,
      }),
      this.guardUrlsRepo.create({
        url: '/api/guards/*',
        type: 'deny',
        guard: dashboardOnly,
      }),
    ]);

    return [
      fullAccess,
      webAccess,
      apiOnly,
      adminOnly,
      readOnlyGuard,
      userMgmtGuard,
      roleMgmtGuard,
      dashboardOnly,
    ];
  }

  private async seedPermissions(): Promise<Permission[]> {
    const fullAccess = this.permissionsRepo.create({
      permissionName: 'Full Access',
      description: 'Izinkan semua method dan URL',
    });
    await this.permissionsRepo.save(fullAccess);
    await this.permissionMethodsRepo.save(
      this.permissionMethodsRepo.create({
        method: '*',
        permission: fullAccess,
      }),
    );
    await this.permissionUrlsRepo.save(
      this.permissionUrlsRepo.create({ url: '/*', permission: fullAccess }),
    );

    const readOnly = this.permissionsRepo.create({
      permissionName: 'Read Only',
      description: 'Hanya izinkan GET dan OPTIONS',
    });
    await this.permissionsRepo.save(readOnly);
    await this.permissionMethodsRepo.save([
      this.permissionMethodsRepo.create({
        method: 'GET',
        permission: readOnly,
      }),
      this.permissionMethodsRepo.create({
        method: 'OPTIONS',
        permission: readOnly,
      }),
    ]);
    await this.permissionUrlsRepo.save(
      this.permissionUrlsRepo.create({ url: '/*', permission: readOnly }),
    );

    const readWrite = this.permissionsRepo.create({
      permissionName: 'Read Write',
      description: 'Izinkan semua method CRUD',
    });
    await this.permissionsRepo.save(readWrite);
    await this.permissionMethodsRepo.save([
      this.permissionMethodsRepo.create({
        method: 'GET',
        permission: readWrite,
      }),
      this.permissionMethodsRepo.create({
        method: 'POST',
        permission: readWrite,
      }),
      this.permissionMethodsRepo.create({
        method: 'PUT',
        permission: readWrite,
      }),
      this.permissionMethodsRepo.create({
        method: 'DELETE',
        permission: readWrite,
      }),
      this.permissionMethodsRepo.create({
        method: 'PATCH',
        permission: readWrite,
      }),
      this.permissionMethodsRepo.create({
        method: 'OPTIONS',
        permission: readWrite,
      }),
    ]);
    await this.permissionUrlsRepo.save(
      this.permissionUrlsRepo.create({ url: '/*', permission: readWrite }),
    );

    const userMgmt = this.permissionsRepo.create({
      permissionName: 'User Management',
      description: 'Izinkan CRUD user',
    });
    await this.permissionsRepo.save(userMgmt);
    await this.permissionMethodsRepo.save([
      this.permissionMethodsRepo.create({
        method: 'GET',
        permission: userMgmt,
      }),
      this.permissionMethodsRepo.create({
        method: 'POST',
        permission: userMgmt,
      }),
      this.permissionMethodsRepo.create({
        method: 'PUT',
        permission: userMgmt,
      }),
      this.permissionMethodsRepo.create({
        method: 'DELETE',
        permission: userMgmt,
      }),
    ]);
    await this.permissionUrlsRepo.save(
      this.permissionUrlsRepo.create({
        url: '/api/users/*',
        permission: userMgmt,
      }),
    );

    const roleMgmt = this.permissionsRepo.create({
      permissionName: 'Role Management',
      description: 'Izinkan CRUD role',
    });
    await this.permissionsRepo.save(roleMgmt);
    await this.permissionMethodsRepo.save([
      this.permissionMethodsRepo.create({
        method: 'GET',
        permission: roleMgmt,
      }),
      this.permissionMethodsRepo.create({
        method: 'POST',
        permission: roleMgmt,
      }),
      this.permissionMethodsRepo.create({
        method: 'PUT',
        permission: roleMgmt,
      }),
      this.permissionMethodsRepo.create({
        method: 'DELETE',
        permission: roleMgmt,
      }),
    ]);
    await this.permissionUrlsRepo.save(
      this.permissionUrlsRepo.create({
        url: '/api/roles/*',
        permission: roleMgmt,
      }),
    );

    const guardMgmt = this.permissionsRepo.create({
      permissionName: 'Guard Management',
      description: 'Izinkan CRUD guard',
    });
    await this.permissionsRepo.save(guardMgmt);
    await this.permissionMethodsRepo.save([
      this.permissionMethodsRepo.create({
        method: 'GET',
        permission: guardMgmt,
      }),
      this.permissionMethodsRepo.create({
        method: 'POST',
        permission: guardMgmt,
      }),
      this.permissionMethodsRepo.create({
        method: 'PUT',
        permission: guardMgmt,
      }),
      this.permissionMethodsRepo.create({
        method: 'DELETE',
        permission: guardMgmt,
      }),
    ]);
    await this.permissionUrlsRepo.save(
      this.permissionUrlsRepo.create({
        url: '/api/guards/*',
        permission: guardMgmt,
      }),
    );

    const permMgmt = this.permissionsRepo.create({
      permissionName: 'Permission Management',
      description: 'Izinkan CRUD permission',
    });
    await this.permissionsRepo.save(permMgmt);
    await this.permissionMethodsRepo.save([
      this.permissionMethodsRepo.create({
        method: 'GET',
        permission: permMgmt,
      }),
      this.permissionMethodsRepo.create({
        method: 'POST',
        permission: permMgmt,
      }),
      this.permissionMethodsRepo.create({
        method: 'PUT',
        permission: permMgmt,
      }),
      this.permissionMethodsRepo.create({
        method: 'DELETE',
        permission: permMgmt,
      }),
    ]);
    await this.permissionUrlsRepo.save(
      this.permissionUrlsRepo.create({
        url: '/api/permissions/*',
        permission: permMgmt,
      }),
    );

    const dashRead = this.permissionsRepo.create({
      permissionName: 'Dashboard Read',
      description: 'Hanya baca profile',
    });
    await this.permissionsRepo.save(dashRead);
    await this.permissionMethodsRepo.save(
      this.permissionMethodsRepo.create({
        method: 'GET',
        permission: dashRead,
      }),
    );
    await this.permissionUrlsRepo.save(
      this.permissionUrlsRepo.create({
        url: '/api/auth/profile',
        permission: dashRead,
      }),
    );

    const activityLogs = this.permissionsRepo.create({
      permissionName: 'Activity Logs',
      description: 'Akses melihat activity logs',
    });
    await this.permissionsRepo.save(activityLogs);
    await this.permissionMethodsRepo.save(
      this.permissionMethodsRepo.create({
        method: 'GET',
        permission: activityLogs,
      }),
    );
    await this.permissionUrlsRepo.save(
      this.permissionUrlsRepo.create({
        url: '/api/activity-logs/*',
        permission: activityLogs,
      }),
    );

    const systemLogs = this.permissionsRepo.create({
      permissionName: 'System Logs',
      description: 'Akses melihat system logs',
    });
    await this.permissionsRepo.save(systemLogs);
    await this.permissionMethodsRepo.save(
      this.permissionMethodsRepo.create({
        method: 'GET',
        permission: systemLogs,
      }),
    );
    await this.permissionUrlsRepo.save(
      this.permissionUrlsRepo.create({
        url: '/api/system-logs/*',
        permission: systemLogs,
      }),
    );

    return [
      fullAccess,
      readOnly,
      readWrite,
      userMgmt,
      roleMgmt,
      guardMgmt,
      permMgmt,
      dashRead,
      activityLogs,
      systemLogs,
    ];
  }

  private async seedRoles(guards: any[], permissions: any[]): Promise<Role[]> {
    const superAdmin = this.rolesRepo.create({
      roleName: 'Super Admin',
      description: 'Akses penuh ke semua fitur',
      guards: [guards[0]],
      permissions: [permissions[0], permissions[8], permissions[9]],
    });
    await this.rolesRepo.save(superAdmin);

    const admin = this.rolesRepo.create({
      roleName: 'Admin',
      description: 'Akses admin terbatas',
      guards: [guards[1]],
      permissions: [permissions[2]],
    });
    await this.rolesRepo.save(admin);

    const user = this.rolesRepo.create({
      roleName: 'User',
      description: 'Akses dasar untuk user biasa',
      guards: [guards[2]],
      permissions: [permissions[1]],
    });
    await this.rolesRepo.save(user);

    const editor = this.rolesRepo.create({
      roleName: 'Editor',
      description: 'Akses edit user dan content',
      guards: [guards[2]],
      permissions: [permissions[2], permissions[3]],
    });
    await this.rolesRepo.save(editor);

    const viewer = this.rolesRepo.create({
      roleName: 'Viewer',
      description: 'Hanya melihat data',
      guards: [guards[4]],
      permissions: [permissions[1], permissions[7]],
    });
    await this.rolesRepo.save(viewer);

    const manager = this.rolesRepo.create({
      roleName: 'Manager',
      description: 'Akses management user dan role',
      guards: [guards[1], guards[5]],
      permissions: [permissions[2], permissions[3], permissions[4]],
    });
    await this.rolesRepo.save(manager);

    const guest = this.rolesRepo.create({
      roleName: 'Guest',
      description: 'Akses terbatas hanya dashboard',
      guards: [guards[7]],
      permissions: [permissions[7]],
    });
    await this.rolesRepo.save(guest);

    return [superAdmin, admin, user, editor, viewer, manager, guest];
  }

  private async seedUsers(roles: Role[]) {
    const hashedPassword = await bcrypt.hash('P455w0rd!!!', 10);

    const admin = this.usersRepo.create({
      firstName: 'Super',
      lastName: 'Admin',
      username: 'admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      roles: [roles[0]],
    });
    await this.usersRepo.save(admin);

    const editor = this.usersRepo.create({
      firstName: 'John',
      lastName: 'Editor',
      username: 'editor',
      email: 'editor@example.com',
      password: hashedPassword,
      roles: [roles[3]],
    });
    await this.usersRepo.save(editor);

    const viewer = this.usersRepo.create({
      firstName: 'Jane',
      lastName: 'Viewer',
      username: 'viewer',
      email: 'viewer@example.com',
      password: hashedPassword,
      roles: [roles[4]],
    });
    await this.usersRepo.save(viewer);

    const manager = this.usersRepo.create({
      firstName: 'Bob',
      lastName: 'Manager',
      username: 'manager',
      email: 'manager@example.com',
      password: hashedPassword,
      roles: [roles[5]],
    });
    await this.usersRepo.save(manager);

    const guest = this.usersRepo.create({
      firstName: 'Alice',
      lastName: 'Guest',
      username: 'guest',
      email: 'guest@example.com',
      password: hashedPassword,
      roles: [roles[6]],
    });
    await this.usersRepo.save(guest);
  }

  private async seedSettings() {
    const defaultSettings = [
      { key: 'app_name', value: 'MyApp' },
      { key: 'app_favicon', value: '/favicon.svg' },
      { key: 'login_bg_gradient', value: '#1e40af,#3b82f6,#6366f1' },
      { key: 'app_description', value: 'Sistem manajemen bisnis digital' },
    ];

    for (const { key, value } of defaultSettings) {
      const exists = await this.settingsRepo.findOne({ where: { key } });
      if (!exists) {
        await this.settingsRepo.save(this.settingsRepo.create({ key, value }));
      }
    }
  }
}
