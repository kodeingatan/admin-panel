# NestJS Database Integration

## TypeORM

```bash
npm i @nestjs/typeorm typeorm pg  # PostgreSQL
npm i @nestjs/typeorm typeorm mysql2  # MySQL
```

### Setup

```typescript
// app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'mydb',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Dev only!
    }),
  ],
})
export class AppModule {}
```

### ConfigModule Integration

```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: configService.get<number>('DATABASE_PORT'),
    username: configService.get('DATABASE_USERNAME'),
    password: configService.get('DATABASE_PASSWORD'),
    database: configService.get('DATABASE_NAME'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: configService.get('NODE_ENV') === 'development',
  }),
  inject: [ConfigService],
}),
```

### Entity

```typescript
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ nullable: true })
  breed: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.cats)
  owner: User;
}
```

### Repository Pattern

```typescript
// cats.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Cat])],
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}

// cats.service.ts
@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catsRepository: Repository<Cat>,
  ) {}

  findAll(): Promise<Cat[]> {
    return this.catsRepository.find();
  }

  findOne(id: number): Promise<Cat> {
    return this.catsRepository.findOneBy({ id });
  }

  create(createCatDto: CreateCatDto): Promise<Cat> {
    const cat = this.catsRepository.create(createCatDto);
    return this.catsRepository.save(cat);
  }

  async update(id: number, updateCatDto: UpdateCatDto): Promise<Cat> {
    await this.catsRepository.update(id, updateCatDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.catsRepository.delete(id);
  }
}
```

### Query Builder

```typescript
const cats = await this.catsRepository
  .createQueryBuilder('cat')
  .where('cat.age > :age', { age: 1 })
  .orderBy('cat.name', 'ASC')
  .getMany();
```

### Transactions

```typescript
const queryRunner = this.dataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();

try {
  await queryRunner.manager.save(cat);
  await queryRunner.manager.save(dog);
  await queryRunner.commitTransaction();
} catch (err) {
  await queryRunner.rollbackTransaction();
} finally {
  await queryRunner.release();
}
```

## Prisma

```bash
npm i prisma @prisma/client
npx prisma init
```

### Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Cat {
  id    Int    @id @default(autoincrement())
  name  String
  age   Int
  breed String?
}
```

### Service

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### Cats Service with Prisma

```typescript
@Injectable()
export class CatsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.cat.findMany();
  }

  findOne(id: number) {
    return this.prisma.cat.findUnique({ where: { id } });
  }

  create(data: CreateCatDto) {
    return this.prisma.cat.create({ data });
  }

  update(id: number, data: UpdateCatDto) {
    return this.prisma.cat.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.cat.delete({ where: { id } });
  }
}
```

## Mongoose (MongoDB)

```bash
npm i @nestjs/mongoose mongoose
```

### Setup

```typescript
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mydb'),
  ],
})
export class AppModule {}
```

### Schema

```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 0 })
  age: number;

  @Prop()
  breed: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);
```

### Mongoose Service

```typescript
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
  ],
})
export class CatsModule {}

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {}

  findAll(): Promise<Cat[]> {
    return this.catModel.find().exec();
  }

  create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = new this.catModel(createCatDto);
    return createdCat.save();
  }
}
```
