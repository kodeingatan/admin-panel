import { QueryDto } from '@/common/dto/query.dto';

export class QueryGuardDto extends QueryDto {
  static readonly sortableFields = ['id', 'guardName', 'description', 'createdAt', 'updatedAt'];
  static readonly searchFields = ['guardName', 'description'];
}
