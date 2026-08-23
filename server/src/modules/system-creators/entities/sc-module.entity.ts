export interface ScModule {
  id: number;
  name: string;
  label: string;
  routePath: string;
  menuLabel: string;
  accessLevel: string;
  accessRoles: string[] | undefined;
  accessPermissions: string[] | undefined;
  isActive: boolean;
  fieldsConfig: string;
  relationsConfig: string | undefined;
  layoutConfig?: string;
  createdAt: Date;
  updatedAt: Date;
}
