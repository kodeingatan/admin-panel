import { QueryDto } from '@/common/dto/query.dto';

export class QueryRoleDto extends QueryDto {
  static readonly sortableFields = [
    'id',
    'roleName',
    'description',
    'createdAt',
    'updatedAt',
  ];
  static readonly searchFields = ['roleName', 'description'];
}
