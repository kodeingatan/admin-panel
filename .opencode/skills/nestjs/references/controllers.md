# NestJS Controllers & Routing

## Controllers

Controllers handle incoming **requests** and return **responses**.

### Basic Controller

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

### HTTP Method Decorators

| Decorator | HTTP Method | Default Status |
|-----------|-------------|----------------|
| `@Get()` | GET | 200 |
| `@Post()` | POST | 201 |
| `@Put()` | PUT | 200 |
| `@Delete()` | DELETE | 200 |
| `@Patch()` | PATCH | 200 |
| `@Options()` | OPTIONS | 200 |
| `@Head()` | HEAD | 200 |
| `@All()` | All methods | 200 |

### Route Parameters

```typescript
@Get(':id')
findOne(@Param('id') id: string): string {
  return `This action returns a #${id} cat`;
}

// With specific param
@Get(':id')
findOne(@Param('id') id: string): string {
  return `This action returns a #${id} cat`;
}
```

### Request Object

```typescript
@Get()
findAll(@Req() request: Request): string {
  return 'This action returns all cats';
}
```

### Param Decorators

| Decorator | Object | Description |
|-----------|--------|-------------|
| `@Request(), @Req()` | `req` | Full request object |
| `@Response(), @Res()` | `res` | Response object (library-specific) |
| `@Next()` | `next` | Next middleware |
| `@Session()` | `req.session` | Session object |
| `@Param(key?)` | `req.params` | Route parameters |
| `@Body(key?)` | `req.body` | Request body |
| `@Query(key?)` | `req.query` | Query string |
| `@Headers(name?)` | `req.headers` | HTTP headers |
| `@Ip()` | `req.ip` | Client IP |
| `@HostParam()` | `req.hosts` | Host parameters |

### Response Handling

**Standard (recommended):**
```typescript
@Get()
findAll(): Cat[] {
  return this.catsService.findAll(); // Auto-serialized to JSON
}
```

**Library-specific:**
```typescript
@Get()
findAll(@Res() res: Response) {
  res.status(HttpStatus.OK).json([]);
}

// With passthrough (both approaches)
@Get()
findAll(@Res({ passthrough: true }) res: Response) {
  res.status(HttpStatus.OK);
  return this.catsService.findAll();
}
```

### Status Codes

```typescript
@Post()
@HttpCode(204)
create() {
  return 'This action adds a new cat';
}
```

### Response Headers

```typescript
@Post()
@Header('Cache-Control', 'no-store')
create() {
  return 'This action adds a new cat';
}
```

### Redirection

```typescript
@Get()
@Redirect('https://nestjs.com', 301)

// Dynamic redirect
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://docs.nestjs.com/v5/' };
  }
}
```

### Route Wildcards

```typescript
@Get('abcd/*')
findAll() {
  return 'This route uses a wildcard';
}
// Matches: abcd/, abcd/123, abcd/abc, etc.
```

### Sub-domain Routing

```typescript
@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  index(): string {
    return 'Admin page';
  }
}

// Dynamic host param
@Controller({ host: ':account.example.com' })
export class AccountController {
  @Get()
  getInfo(@HostParam('account') account: string) {
    return account;
  }
}
```

### DTO (Data Transfer Object)

```typescript
// create-cat.dto.ts
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}

// cats.controller.ts
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  return 'This action adds a new cat';
}
```

### Query Parameters

```typescript
@Get()
async findAll(@Query('age') age: number, @Query('breed') breed: string) {
  return `Cats filtered by age: ${age} and breed: ${breed}`;
}
```

### Full CRUD Example

```typescript
@Controller('cats')
export class CatsController {
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `This action returns all cats (limit: ${query.limit} items)`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
```

### Asynchronicity

```typescript
// Async
@Get()
async findAll(): Promise<any[]> {
  return [];
}

// RxJS Observable
@Get()
findAll(): Observable<any[]> {
  return of([]);
}
```

### Register Controller in Module

```typescript
@Module({
  controllers: [CatsController],
})
export class AppModule {}
```

### CRUD Generator

```bash
nest g resource cats
```
