import { QueryDto } from '@/common/dto/query.dto';

export class QueryScModuleDto extends QueryDto {
  static readonly searchableFields = ['name', 'label', 'menuLabel'];
  static readonly sortableFields = ['id', 'name', 'label', 'menuLabel', 'accessLevel', 'isActive', 'createdAt', 'updatedAt'];
}
