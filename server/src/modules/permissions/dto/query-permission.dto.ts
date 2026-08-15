import { QueryDto } from '@/common/dto/query.dto';

export class QueryPermissionDto extends QueryDto {
  static readonly sortableFields = [
    'id',
    'permissionName',
    'description',
    'createdAt',
    'updatedAt',
  ];
  static readonly searchFields = ['permissionName', 'description'];
}
