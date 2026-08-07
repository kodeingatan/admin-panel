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

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Role) private rolesRepo: Repository<Role>,
    @InjectRepository(Permission) private permissionsRepo: Repository<Permission>,
    @InjectRepository(PermissionMethod)
    private permissionMethodsRepo: Repository<PermissionMethod>,
    @InjectRepository(PermissionUrl)
    private permissionUrlsRepo: Repository<PermissionUrl>,
    @InjectRepository(Guard) private guardsRepo: Repository<Guard>,
    @InjectRepository(GuardUrl) private guardUrlsRepo: Repository<GuardUrl>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const userCount = await this.usersRepo.count();
    if (userCount > 0) {
      this.logger.log('Database already seeded, skipping...');
      return;
    }

    this.logger.log('Seeding database...');

    const guards = await this.seedGuards();
    const permissions = await this.seedPermissions();
    const roles = await this.seedRoles(guards, permissions);
    await this.seedUsers(roles);

    this.logger.log('Database seeded successfully');
  }

  private async seedGuards(): Promise<Role[]> {
    const fullAccess = this.guardsRepo.create({
      guardName: 'Full Access',
      description: 'Izinkan semua URL',
    });
    await this.guardsRepo.save(fullAccess);
    await this.guardUrlsRepo.save(
      this.guardUrlsRepo.create({ url: '/*', type: 'allow', guard: fullAccess }),
    );

    const webAccess = this.guardsRepo.create({
      guardName: 'Web Access',
      description: 'Hanya akses API, tolak admin routes',
    });
    await this.guardsRepo.save(webAccess);
    await this.guardUrlsRepo.save([
      this.guardUrlsRepo.create({ url: '/api/*', type: 'allow', guard: webAccess }),
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
      this.guardUrlsRepo.create({ url: '/api/*', type: 'allow', guard: apiOnly }),
    );

    return [fullAccess, webAccess, apiOnly] as any;
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
      this.permissionMethodsRepo.create({ method: 'GET', permission: readOnly }),
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
      this.permissionMethodsRepo.create({ method: 'GET', permission: readWrite }),
      this.permissionMethodsRepo.create({
        method: 'POST',
        permission: readWrite,
      }),
      this.permissionMethodsRepo.create({ method: 'PUT', permission: readWrite }),
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

    return [fullAccess, readOnly, readWrite] as any;
  }

  private async seedRoles(guards: any[], permissions: any[]): Promise<Role[]> {
    const superAdmin = this.rolesRepo.create({
      roleName: 'Super Admin',
      description: 'Akses penuh ke semua fitur',
      guards: [guards[0]],
      permissions: [permissions[0]],
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

    return [superAdmin, admin, user];
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
  }
}
