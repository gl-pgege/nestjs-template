# NestJS Financial Alerts Template

A production-ready NestJS template with financial alerts schema, built with Prisma ORM and following best coding practices. This template provides the foundation for building financial monitoring and alerts management systems.

## Architecture Overview

This template follows a modular architecture pattern designed for financial systems where each entity should be organized into separate modules containing:

- **Controller**: Handles HTTP requests and responses with comprehensive API documentation
- **Service**: Contains business logic for financial operations and alert management  
- **Repository**: Database access layer (only layer that interacts with the database)
- **DTOs**: Data Transfer Objects with strict validation for financial data integrity

## Repository Pattern

The template implements a comprehensive repository pattern with:

- **BaseRepository**: Abstract base class that all repositories extend
- **Database Abstraction**: Only repositories should interact with the Prisma client
- **Relationship Handling**: Proper loading of related entities and complex queries
- **Type Safety**: Full TypeScript support with generated Prisma types

## Financial Schema Features

The included schema supports:

- **Entity Management**: People, businesses, government entities, and other financial actors
- **Account Management**: Various account types (checking, savings, credit, investment)
- **Transaction Processing**: Financial transactions with full audit trails
- **Alert System**: Security and compliance alerts with investigation workflows
- **Device Tracking**: Login monitoring and device fingerprinting
- **Investigation Workflow**: Complete case management with actions and summaries

## Directory Structure

```
src/
├── common/                 # Shared utilities and base classes
│   └── base-repository.ts  # Abstract base repository class
├── database/              # Database configuration and services
│   ├── database.module.ts
│   └── alerts-database.service.ts     # Database client service
├── modules/               # Feature modules (create as needed)
│   └── [entity]/         # Example module structure for each entity
│       ├── [entity].controller.ts
│       ├── [entity].service.ts
│       ├── [entity].repository.ts
│       ├── [entity].dto.ts
│       └── [entity].module.ts
├── app.controller.ts     # Root controller
├── app.service.ts       # Root service
├── app.module.ts        # Root module
└── main.ts             # Application entry point

prisma/
└── alerts/
    └── schema.prisma    # Financial alerts database schema
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   yarn install
   ```

2. **Environment Configuration**
   Set up your `.env` file with database URL:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/alerts_db?schema=public"
   NODE_ENV="development"
   PORT=3000
   HOST=0.0.0.0
   ```

3. **Generate Prisma Client**
   ```bash
   yarn prisma:generate
   ```

4. **Run Database Migrations**
   ```bash
   yarn prisma:migrate
   ```

5. **Start Development Server**
   ```bash
   yarn start          # Production mode
   yarn start:dev      # Development mode with hot reload
   ```

   The server will be accessible from any host on your network at `http://0.0.0.0:3000`

## Prisma Commands

- `yarn prisma:generate` - Generate Prisma client
- `yarn prisma:migrate` - Run database migrations
- `yarn prisma:deploy` - Deploy migrations to production
- `yarn prisma:studio` - Open Prisma Studio
- `yarn prisma:reset` - Reset database and run migrations

## Coding Patterns

### Repository Pattern Implementation

All repositories should extend the `BaseRepository` abstract class:

```typescript
export abstract class BaseRepository<T, CreateData, UpdateData> {
  abstract create(data: CreateData): Promise<T>;
  abstract findById(id: string): Promise<T | null>;
  abstract findMany(params?: any): Promise<T[]>;
  abstract update(id: string, data: UpdateData): Promise<T>;
  abstract delete(id: string): Promise<T>;
}
```

Example repository implementation:

```typescript
@Injectable()
export class EntityRepository extends BaseRepository<Entity, CreateEntityDto, UpdateEntityDto> {
  constructor(private readonly prisma: AlertsDatabaseService) {
    super();
  }

  async create(data: CreateEntityDto): Promise<Entity> {
    return this.prisma.entity.create({ 
      data,
      include: { accounts: true }
    });
  }

  async findById(entityId: string): Promise<Entity | null> {
    return this.prisma.entity.findUnique({
      where: { entityId },
      include: { 
        accounts: true,
        sentTransactions: { take: 10 },
        receivedTransactions: { take: 10 }
      }
    });
  }
  
  // ... other methods
}
```

### Module Organization
- Each entity has its own module directory  
- DTOs are kept within their respective modules [[memory:7753673]]
- Each module exports services and repositories for use by other modules
- Only repositories interact with the database directly

### Database Access
- Single PostgreSQL database with comprehensive financial data model
- Global database module provides the `AlertsDatabaseService` to all modules
- Complex relationships handled through Prisma includes and transactions
- Type-safe database operations with generated Prisma client

### API Documentation
w- Swagger documentation always enabled and available at `/api/docs`
- Interactive API explorer with schema documentation
- Health check endpoint available at root `/`

## Database Schema

The template includes a comprehensive financial schema with the following entities:

### Core Entities
- **Entity**: People, businesses, government entities, or other financial actors
- **Account**: Bank accounts linked to entities with various account types
- **Transaction**: Financial transactions between entities/accounts with full audit trails
- **Alert**: Security and compliance alerts with investigation workflows

### Supporting Entities  
- **AccountActivity**: Login and device tracking for security monitoring
- **InvestigationSummary & InvestigationAction**: Complete investigation workflow
- **AccountActivityEntity**: Many-to-many relationship for activity tracking
- **AlertTransactionLink**: Links alerts to related transactions

### Enums
- **EntityTypeEnum**: person, business, government, other
- **AccountTypeEnum**: personal, business, checking, savings, credit, investment, other
- **AlertStatusEnum**: open, in_progress, resolved, closed  
- **DeviceTypeEnum**: Mobile, Web, ATM, Branch, Other, teller, mobile_app, desktop_browser

## Creating New Modules

To create a new module following the repository pattern:

### 1. Create Module Directory
```bash
mkdir -p src/modules/[entity]
```

### 2. Create DTOs (`[entity].dto.ts`)
```typescript
import { IsString, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Create[Entity]Dto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  id: string;
  
  // ... other fields with validation
}

export class Update[Entity]Dto {
  // ... optional fields for updates
}

export class [Entity]ResponseDto {
  // ... response structure
}
```

### 3. Create Repository (`[entity].repository.ts`)
```typescript
import { Injectable } from '@nestjs/common';
import { [Entity] } from '@prisma/alerts-client';
import { AlertsDatabaseService } from '@/database/alerts-database.service';
import { BaseRepository } from '@/common/base-repository';

@Injectable()
export class [Entity]Repository extends BaseRepository<[Entity], Create[Entity]Dto, Update[Entity]Dto> {
  constructor(private readonly prisma: AlertsDatabaseService) {
    super();
  }

  async create(data: Create[Entity]Dto): Promise<[Entity]> {
    return this.prisma.[entity].create({ data });
  }

  async findById(id: string): Promise<[Entity] | null> {
    return this.prisma.[entity].findUnique({ where: { id } });
  }

  // ... implement other abstract methods
}
```

### 4. Create Service (`[entity].service.ts`)
```typescript
import { Injectable } from '@nestjs/common';
import { [Entity]Repository } from './[entity].repository';

@Injectable()
export class [Entity]Service {
  constructor(private readonly [entity]Repository: [Entity]Repository) {}

  // Business logic methods
}
```

### 5. Create Controller (`[entity].controller.ts`)
```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { [Entity]Service } from './[entity].service';

@ApiTags('[Entity]')
@Controller('[entity]')
export class [Entity]Controller {
  constructor(private readonly [entity]Service: [Entity]Service) {}

  // API endpoints
}
```

### 6. Create Module (`[entity].module.ts`)  
```typescript
import { Module } from '@nestjs/common';
import { [Entity]Controller } from './[entity].controller';
import { [Entity]Service } from './[entity].service';
import { [Entity]Repository } from './[entity].repository';

@Module({
  controllers: [[Entity]Controller],
  providers: [[Entity]Service, [Entity]Repository],
  exports: [[Entity]Service, [Entity]Repository],
})
export class [Entity]Module {}
```

### 7. Import in `app.module.ts`
```typescript
import { [Entity]Module } from './modules/[entity]/[entity].module';

@Module({
  imports: [
    // ... other imports
    [Entity]Module,
  ],
})
export class AppModule {}
```

## Key Principles

1. **Repository Pattern**: Only repositories interact with the database
2. **Service Layer**: Business logic resides in services
3. **DTO Validation**: Strict validation for all inputs and outputs
4. **Relationship Loading**: Use Prisma includes for related data
5. **Error Handling**: Proper exception handling in services
6. **Type Safety**: Leverage TypeScript and Prisma generated types
