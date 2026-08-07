# NestJS Testing

## Overview

NestJS uses Jest as the default testing framework.

## Setup

```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:cov      # Coverage
npm run test:e2e      # E2E tests
```

## Unit Testing

### Service Test

```typescript
// cats.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';

describe('CatsService', () => {
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatsService],
    }).compile();

    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cats', () => {
      const result = service.findAll();
      expect(result).toEqual([]);
    });
  });
});
```

### Controller Test

```typescript
// cats.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: CatsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({ id: 1, name: 'Kitty' }),
            create: jest.fn().mockResolvedValue({ id: 1, name: 'Kitty' }),
          },
        },
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a cat', async () => {
      const dto = { name: 'Kitty', age: 2, breed: 'Persian' };
      const result = await controller.create(dto);
      expect(result).toEqual({ id: 1, name: 'Kitty' });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });
});
```

## Mocking

### Mock Service

```typescript
const mockCatsService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const module = await Test.createTestingModule({
  providers: [
    { provide: CatsService, useValue: mockCatsService },
  ],
}).compile();
```

### Mock Repository (TypeORM)

```typescript
const mockRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const module = await Test.createTestingModule({
  providers: [
    CatsService,
    {
      provide: getRepositoryToken(Cat),
      useValue: mockRepository,
    },
  ],
}).compile();
```

### Mock ConfigService

```typescript
const mockConfigService = {
  get: jest.fn((key: string) => {
    const config = { DATABASE_HOST: 'localhost', DATABASE_PORT: 5432 };
    return config[key];
  }),
};
```

## E2E Testing

### Setup

```typescript
// cats.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Cats (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/GET cats', () => {
    return request(app.getHttpServer())
      .get('/cats')
      .expect(200)
      .expect([]);
  });

  it('/POST cats', () => {
    return request(app.getHttpServer())
      .post('/cats')
      .send({ name: 'Kitty', age: 2 })
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toEqual('Kitty');
      });
  });
});
```

### Run E2E Tests

```bash
npm run test:e2e
```

## Testing Modules

### Override Providers

```typescript
const module = await Test.createTestingModule({
  imports: [AppModule],
})
  .overrideProvider(CatsService)
  .useValue(mockCatsService)
  .compile();
```

### Override External Dependencies

```typescript
const module = await Test.createTestingModule({
  imports: [AppModule],
})
  .overrideProvider(getRepositoryToken(Cat))
  .useValue(mockRepository)
  .compile();
```

## Spies

```typescript
// Jest spies
const spy = jest.spyOn(service, 'findAll').mockResolvedValue([]);

// Verify call
expect(spy).toHaveBeenCalledTimes(1);
expect(spy).toHaveBeenCalledWith(expectedArgs);
```

## Snapshot Testing

```typescript
it('should match snapshot', () => {
  const result = service.findAll();
  expect(result).toMatchSnapshot();
});
```
