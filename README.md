# NestJS Template with Multi-Database Prisma Support

A production-ready NestJS template with Prisma ORM supporting multiple database clients and following best coding practices.

## Architecture Overview

This template follows a modular architecture pattern where each entity is organized into separate modules containing:

- **Controller**: Handles HTTP requests and responses
- **Service**: Contains business logic
- **Repository**: Database access layer (only layer that interacts with the database)
- **DTOs**: Data Transfer Objects for request/response validation

## Directory Structure

```
src/
├── common/                 # Shared utilities and base classes
│   └── base-repository.ts  # Abstract base repository class
├── database/              # Database configuration and services
│   ├── database.module.ts
│   ├── primary-database.service.ts    # Primary database client
│   └── secondary-database.service.ts  # Secondary database client
├── modules/               # Feature modules
│   ├── user/             # User module (uses primary database)
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   ├── user.dto.ts
│   │   └── user.module.ts
│   └── analytics/        # Analytics module (uses secondary database)
│       ├── analytics.controller.ts
│       ├── analytics.service.ts
│       ├── analytics.repository.ts
│       ├── analytics.dto.ts
│       └── analytics.module.ts
├── app.controller.ts     # Root controller
├── app.service.ts       # Root service
├── app.module.ts        # Root module
└── main.ts             # Application entry point

prisma/
├── primary/
│   └── schema.prisma    # Primary database schema
└── secondary/
    └── schema.prisma    # Secondary database schema
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   yarn install
   ```

2. **Environment Configuration**
   Copy `.env.example` to `.env` and update database URLs:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/primary_db?schema=public"
   SECONDARY_DATABASE_URL="postgresql://username:password@localhost:5432/secondary_db?schema=public"
   ```

3. **Generate Prisma Clients**
   ```bash
   yarn prisma:generate
   ```

4. **Run Database Migrations**
   ```bash
   yarn prisma:migrate
   ```

5. **Start Development Server**
   ```bash
   yarn start
   ```

## Prisma Multi-Client Commands

- `yarn prisma:generate` - Generate both clients
- `yarn prisma:generate:primary` - Generate primary client only
- `yarn prisma:generate:secondary` - Generate secondary client only
- `yarn prisma:migrate` - Run migrations for both databases
- `yarn prisma:migrate:primary` - Run primary database migrations
- `yarn prisma:migrate:secondary` - Run secondary database migrations
- `yarn prisma:studio:primary` - Open Prisma Studio for primary database
- `yarn prisma:studio:secondary` - Open Prisma Studio for secondary database

## Coding Patterns

### Repository Pattern
- Only repositories access the database directly
- Services contain business logic and call repositories
- Controllers handle HTTP requests and call services

### Module Organization
- Each entity has its own module directory
- DTOs are kept within their respective modules
- Each module exports services and repositories for use by other modules

### Database Access
- Primary database: User data, core application data
- Secondary database: Analytics, logs, non-critical data
- Global database module provides both clients to all modules

### API Documentation
- Swagger documentation available at `/api/docs`
- All endpoints documented with proper response types
- DTOs include validation and API property decorators

## Example Module Creation

To create a new module, follow this pattern:

1. Create module directory: `src/modules/[entity]/`
2. Create DTOs with validation: `[entity].dto.ts`
3. Create repository extending BaseRepository: `[entity].repository.ts`
4. Create service with business logic: `[entity].service.ts`
5. Create controller with API endpoints: `[entity].controller.ts`
6. Create module configuration: `[entity].module.ts`
7. Import module in `app.module.ts`

Each repository should extend the `BaseRepository` abstract class and implement the required methods for CRUD operations.
