# NestJS Microservices

## Overview

Nest supports microservice architectures with multiple transport layers.

## Setup

```bash
npm i @nestjs/microservices
```

### TCP Transport

```typescript
// main.ts
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.TCP,
  options: {
    host: '127.0.0.1',
    port: 3001,
  },
});
await app.listen();
```

### RabbitMQ Transport

```typescript
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'],
    queue: 'cats_queue',
    queueOptions: { durable: false },
  },
});
```

### Kafka Transport

```typescript
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'cats',
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'cats-consumer',
    },
  },
});
```

### Redis Transport

```typescript
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.REDIS,
  options: {
    url: 'redis://localhost:6379',
  },
});
```

## Message Patterns

### Controller

```typescript
@Controller()
export class CatsController {
  @MessagePattern({ cmd: 'get_cats' })
  findAll(): Cat[] {
    return this.catsService.findAll();
  }

  @MessagePattern({ cmd: 'get_cat' })
  findOne(@Payload() data: { id: number }): Cat {
    return this.catsService.findOne(data.id);
  }

  @EventPattern('create_cat')
  handleCreate(@Payload() data: CreateCatDto) {
    this.catsService.create(data);
  }
}
```

## Client Proxies

### TCP Client

```typescript
// cats.module.ts
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CATS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3001,
        },
      },
    ]),
  ],
})
export class CatsModule {}
```

### Usage

```typescript
@Injectable()
export class CatsService {
  constructor(
    @Inject('CATS_SERVICE') private client: ClientProxy,
  ) {}

  findAll() {
    return this.client.send({ cmd: 'get_cats' }, {});
  }

  create(createCatDto: CreateCatDto) {
    this.client.emit('create_cat', createCatDto);
  }
}
```

## Event Emitter

```bash
npm i @nestjs/event-emitter
```

```typescript
// app.module.ts
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [EventEmitterModule.forRoot()],
})
export class AppModule {}
```

### Emit Events

```typescript
@Injectable()
export class CatsService {
  constructor(private eventEmitter: EventEmitter2) {}

  create(createCatDto: CreateCatDto) {
    const cat = this.catsRepository.create(createCatDto);
    this.eventEmitter.emit('cat.created', cat);
    return cat;
  }
}
```

### Listen Events

```typescript
@Injectable()
export class CatsListener {
  @OnEvent('cat.created')
  handleCatCreated(cat: Cat) {
    // Handle event
  }
}
```

## Hybrid Application

```typescript
const app = await NestFactory.create(AppModule);

const microservice = app.connectMicroservice<MicroserviceOptions>({
  transport: Transport.TCP,
  options: {
    host: '127.0.0.1',
    port: 3001,
  },
});

await microservice.listen();
await app.listen(3000);
```

## Pattern Matching

```typescript
// Specific pattern
@MessagePattern({ cmd: 'get_cats' })

// With namespace
@MessagePattern({ cmd: 'get_cats', namespace: 'cats' })

// Event pattern
@EventPattern('create_cat')
```

## Request-response vs Events

| Pattern | Type | Response |
|---------|------|----------|
| `@MessagePattern` | Request-response | Returns result |
| `@EventPattern` | Fire-and-forget | No response |
