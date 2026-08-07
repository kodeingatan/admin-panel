import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '@/modules/users/services/users.service';
import { ROLES_KEY } from '@/common/decorators/roles.decorator';
import { PERMISSIONS_KEY } from '@/common/decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles && !requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.sub) {
      throw new ForbiddenException('User not authenticated');
    }

    const fullUser = await this.usersService.findOneWithRoles(user.sub);
    if (!fullUser) {
      throw new ForbiddenException('User not found');
    }

    if (requiredRoles?.length) {
      const userRoleNames = fullUser.roles.map((r) => r.roleName);
      const hasRole = requiredRoles.some((role) =>
        userRoleNames.includes(role),
      );
      if (!hasRole) {
        throw new ForbiddenException(
          `Required roles: ${requiredRoles.join(', ')}`,
        );
      }
    }

    if (requiredPermissions?.length) {
      const userPermissionNames = fullUser.roles.flatMap((r) =>
        r.permissions.map((p) => p.permissionName),
      );
      const uniquePermissions = [...new Set(userPermissionNames)];
      const hasPermission = requiredPermissions.some((perm) =>
        uniquePermissions.includes(perm),
      );
      if (!hasPermission) {
        throw new ForbiddenException(
          `Required permissions: ${requiredPermissions.join(', ')}`,
        );
      }
    }

    const httpMethod = request.method.toUpperCase();
    const requestUrl = request.url;

    for (const role of fullUser.roles) {
      for (const permission of role.permissions) {
        const allowedMethods = permission.methods.map((m) =>
          m.method.toUpperCase(),
        );
        if (
          !allowedMethods.includes('*') &&
          !allowedMethods.includes(httpMethod)
        ) {
          continue;
        }

        const allowedUrls = permission.urls.map((u) => u.url);
        const urlMatch = allowedUrls.some((pattern) =>
          this.matchUrl(pattern, requestUrl),
        );
        if (!urlMatch) continue;

        for (const guard of role.guards) {
          const allowUrls = guard.urls
            .filter((u) => u.type === 'allow')
            .map((u) => u.url);
          const denyUrls = guard.urls
            .filter((u) => u.type === 'deny')
            .map((u) => u.url);

          const isDenied = denyUrls.some((pattern) =>
            this.matchUrl(pattern, requestUrl),
          );
          if (isDenied) continue;

          const isAllowed = allowUrls.some((pattern) =>
            this.matchUrl(pattern, requestUrl),
          );
          if (isAllowed) return true;
        }
      }
    }

    throw new ForbiddenException('Access denied');
  }

  private matchUrl(pattern: string, url: string): boolean {
    if (pattern === '/*') return true;

    const cleanPattern = pattern.replace(/\/+$/, '');
    const cleanUrl = url.split('?')[0].replace(/\/+$/, '');

    if (cleanPattern.endsWith('/*')) {
      const prefix = cleanPattern.slice(0, -2);
      return cleanUrl === prefix || cleanUrl.startsWith(prefix + '/');
    }

    return cleanUrl === cleanPattern;
  }
}
