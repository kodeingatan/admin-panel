## Vue 3 Best Practices Architecture
```
client/
│
├── .storybook/                 # Konfigurasi Storybook
│   ├── main.ts
│   ├── preview.ts
│   ├── manager.ts
│   └── theme.ts
│
├── public/                     # Static assets
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │
│   ├── components/
│   │   ├── base/
│   │   ├── common/
│   │   └── layout/
│   │
│   ├── composables/
│   │
│   ├── constants/
│   │
│   ├── directives/
│   │
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── products/
│   │
│   ├── layouts/
│   │
│   ├── plugins/
│   │
│   ├── router/
│   │
│   ├── services/
│   │
│   ├── stores/
│   │
│   ├── types/
│   │
│   ├── utils/
│   │
│   ├── views/
│   │
│   ├── App.vue
│   └── main.ts
│
├── stories/                    # Storybook documentation
│   ├── introduction/
│   │   └── GettingStarted.mdx
│   │
│   ├── foundations/
│   │   ├── Colors.mdx
│   │   ├── Typography.mdx
│   │   ├── Icons.mdx
│   │   └── Spacing.mdx
│   │
│   ├── components/
│   │   ├── base/
│   │   │   ├── Button.stories.ts
│   │   │   ├── Input.stories.ts
│   │   │   └── Modal.stories.ts
│   │   │
│   │   ├── common/
│   │   └── layout/
│   │
│   ├── patterns/
│   │   ├── Forms.mdx
│   │   ├── Tables.mdx
│   │   └── Dashboard.mdx
│   │
│   ├── examples/
│   │   ├── LoginPage.stories.ts
│   │   └── ProductCard.stories.ts
│   │
│   └── assets/
│
├── tests/
│
├── .env
├── .env.development
├── .env.production
│
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## NestJS Best Practices Architecture
```
server/
│
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   │
│   ├── common/                     # Shared modules
│   │   ├── decorators/
│   │   ├── dto/
│   │   ├── exceptions/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── middleware/
│   │   ├── pipes/
│   │   ├── serializers/
│   │   ├── types/
│   │   └── utils/
│   │
│   ├── config/                     # Application configuration
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── validation.ts
│   │
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   ├── factories/
│   │   └── database.module.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   ├── strategies/
│   │   │   ├── guards/
│   │   │   ├── interfaces/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.service.ts
│   │   │
│   │   ├── users/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   ├── repositories/
│   │   │   ├── interfaces/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   └── users.service.ts
│   │   │
│   │   ├── products/
│   │   └── orders/
│   │
│   ├── providers/                  # Global providers
│   │
│   └── shared/                     # Shared business logic
│       ├── cache/
│       ├── mail/
│       ├── queue/
│       ├── storage/
│       └── logger/
│
├── test/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── uploads/
├── scripts/
│
├── .env
├── .env.development
├── .env.production
├── .env.test
│
├── nest-cli.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── README.md
```

## Tujuan
membuat structure file rapi dan clean code

## Instruksi
- create or update docs/architecture.md
- create tasks/02-impl-architecture.md :
    implementasi semua pada docs/architecture.md dan sesuaikan semua structure file

jangan koding dulu, hanya ikuti instruksi