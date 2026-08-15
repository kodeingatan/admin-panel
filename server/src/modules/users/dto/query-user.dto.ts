import { QueryDto } from '@/common/dto/query.dto';

export class QueryUserDto extends QueryDto {
  static readonly sortableFields = [
    'id',
    'firstName',
    'lastName',
    'username',
    'email',
    'createdAt',
    'updatedAt',
  ];
  static readonly searchFields = ['firstName', 'lastName', 'username', 'email'];
}
