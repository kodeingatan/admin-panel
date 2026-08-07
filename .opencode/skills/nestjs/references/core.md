# NestJS Core Concepts & First Steps

## Overview

NestJS is a progressive Node.js framework for building efficient, scalable server-side applications. It uses TypeScript and combines OOP, FP, and FRP patterns.

## Prerequisites

- Node.js >= 20
- npm or yarn

## Setup

```bash
npm i -g @nestjs/cli
nest new project-name
nest new project-name --strict  # Strict TypeScript
```

## Project Structure

```
src/
├── app.controller.spec.ts  # Unit tests
├── app.controller.ts       # Basic controller
├── app.module.ts           # Root module
├── app.service.ts          # Basic service
└── main.ts                 # Entry point
```

## Bootstrap

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

### NestFactory Methods

```typescript
// Create app
const app = await NestFactory.create(AppModule);

// With explicit Express types
const app = await NestFactory.create<NestExpressApplication>(AppModule);

// With Fastify
const app = await NestFactory.create<NestFastifyApplication>(
  AppModule,
  new FastifyAdapter(),
);

// Abort on error (default: true)
const app = await NestFactory.create(AppModule, { abortOnError: false });
```

## Platform

| Platform | Package | Description |
|----------|---------|-------------|
| Express (default) | `@nestjs/platform-express` | Well-known, battle-tested |
| Fastify | `@nestjs/platform-fastify` | High performance, low overhead |

## Running

```bash
npm run start          # Start app
npm run start:dev      # Start with file watching
npm run start:debug    # Start in debug mode
npm run start:prod     # Production
```

### SWC Builder (20x faster)

```bash
npm run start -- -b swc
```

## Linting & Formatting

```bash
npm run lint           # ESLint
npm run format         # Prettier
```

## Key Principles

1. **Platform-agnostic** — Works with any Node HTTP framework
2. **TypeScript-first** — Full TypeScript support
3. **Modular architecture** — Organize code into modules
4. **Dependency injection** — Built-in IoC container
5. **Decorators** — Use decorators for metadata and routing
6. **Testable** — Built-in testing utilities
