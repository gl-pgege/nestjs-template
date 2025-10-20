# NestJS Financial Alerts API - Development Guide

## 🚨 CRITICAL RULES - READ FIRST

### 1. READ-ONLY API ONLY
- **ONLY create GET endpoints** (or POST for complex queries with request bodies)
- **NEVER** create/update/delete operations - this is a query-only system
- Use Prisma's `findMany`, `findUnique`, `count`, `aggregate` - NEVER `create`, `update`, `delete`

### 2. SERVER IS RUNNING - DON'T BREAK IT
- **NEVER run** `npm start`, `yarn start` - server is already running
- **ALWAYS run** `npm run build` before finishing any task to verify code compiles
- Server auto-reloads on file changes - watch console for errors

### 3. USE EXISTING DATABASE SERVICE
```typescript
// ✅ CORRECT - Use the existing service
import { AlertsDatabaseService } from '../../database/alerts-database.service';

@Injectable()
export class YourRepository {
  constructor(private readonly prisma: AlertsDatabaseService) {}
}

// ❌ NEVER - Import database drivers directly
import { Pool } from 'pg';           // ❌ WRONG
import { PrismaClient } from '@prisma/client';  // ❌ WRONG - use alerts-client
```

### 4. PRISMA FIELD NAMES (MOST COMMON ERROR)
```typescript
// ✅ CORRECT - Use camelCase client fields
where: { alertId: id }        // alertId (NOT alert_id)
where: { entityId: id }       // entityId (NOT entity_id)
select: { alertId: true }     // alertId (NOT alert_id)

// ❌ WRONG - Never use snake_case database columns
where: { alert_id: id }       // ❌ TypeScript ERROR
where: { entity_id: id }      // ❌ TypeScript ERROR
```

## MANDATORY WORKFLOW

### Implementation Steps
1. **Read existing files** to understand current structure
2. **Create/Update module files** (controller, service, repository, DTO, module)
3. **Import module** in `src/app.module.ts` 
4. **🚨 MANDATORY: Run** `npm run build` (must pass with 0 errors)
5. **Test endpoints** at `http://0.0.0.0:3000/api/docs`

### Module Structure (Required)
```
src/modules/[entity]/
├── [entity].controller.ts    # HTTP endpoints with Swagger docs
├── [entity].service.ts       # Business logic
├── [entity].repository.ts    # Database access (extends BaseRepository)
├── [entity].dto.ts          # Request/response validation
└── [entity].module.ts       # Module configuration
```

### 5. DATABASE SCHEMA
- **Schema location**: `prisma/alerts/schema.prisma` 
- **Read the schema** to understand available models and field names
- **Use camelCase field names** from the Prisma client (NOT snake_case database columns)

## WORKING EXAMPLES

### Complete Working Repository
```typescript
import { Injectable } from '@nestjs/common';
import { Alert } from '@prisma/alerts-client';
import { AlertsDatabaseService } from '../../database/alerts-database.service';
import { BaseRepository } from '../../common/base-repository';

@Injectable()
export class AlertsRepository extends BaseRepository<Alert, never, never> {
  constructor(private readonly prisma: AlertsDatabaseService) {
    super();
  }

  async findById(alertId: string): Promise<Alert | null> {
    return this.prisma.alert.findUnique({
      where: { alertId },                    // ✅ camelCase
      include: {
        associatedAccount: {
          include: { entity: true }
        }
      }
    });
  }

  async findMany(filters: { status?: string; take?: number; skip?: number }): Promise<Alert[]> {
    return this.prisma.alert.findMany({
      where: { status: filters.status },
      include: { associatedAccount: { include: { entity: true } } },
      take: filters.take || 10,
      skip: filters.skip || 0,
      orderBy: { dateTime: 'desc' }         // ✅ camelCase
    });
  }

  // Read-only repository - these throw errors
  async create(): Promise<never> { throw new Error('Read-only repository'); }
  async update(): Promise<never> { throw new Error('Read-only repository'); }
  async delete(): Promise<never> { throw new Error('Read-only repository'); }
}
```

### Complete Working Controller
```typescript
import { Controller, Get, Param, Query, BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { AlertResponseDto } from './alerts.dto';

@ApiTags('Alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @ApiOperation({ summary: 'Get alerts with filtering and pagination' })
  @ApiQuery({ name: 'status', required: false, description: 'Alert status filter' })
  @ApiQuery({ name: 'take', required: false, type: Number, description: 'Number of records' })
  @ApiQuery({ name: 'skip', required: false, type: Number, description: 'Records to skip' })
  @ApiResponse({ status: 200, description: 'Alerts retrieved', type: [AlertResponseDto] })
  async getAlerts(
    @Query('status') status?: string,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
  ): Promise<AlertResponseDto[]> {
    const takeNum = take ? parseInt(take) : undefined;
    const skipNum = skip ? parseInt(skip) : undefined;
    return this.alertsService.getAlerts({ status, take: takeNum, skip: skipNum });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get alert by ID' })
  @ApiResponse({ status: 200, description: 'Alert found', type: AlertResponseDto })
  @ApiResponse({ status: 404, description: 'Alert not found' })
  async getAlert(@Param('id') id: string): Promise<AlertResponseDto> {
    if (!id?.trim()) throw new BadRequestException('Alert ID is required');
    const alert = await this.alertsService.getAlert(id);
    if (!alert) throw new NotFoundException(`Alert ${id} not found`);
    return alert;
  }
}
```

### Complete Working Service
```typescript
import { Injectable } from '@nestjs/common';
import { AlertsRepository } from './alerts.repository';
import { AlertResponseDto } from './alerts.dto';

@Injectable()
export class AlertsService {
  constructor(private readonly alertsRepository: AlertsRepository) {}

  async getAlerts(filters: { status?: string; take?: number; skip?: number }): Promise<AlertResponseDto[]> {
    const alerts = await this.alertsRepository.findMany(filters);
    return alerts.map(alert => ({
      alertId: alert.alertId,
      dateTime: alert.dateTime,
      status: alert.status,
      description: alert.description,
      associatedAccount: alert.associatedAccount ? {
        accountId: alert.associatedAccount.accountId,
        entityName: alert.associatedAccount.entity?.entityName
      } : null
    }));
  }

  async getAlert(alertId: string): Promise<AlertResponseDto | null> {
    const alert = await this.alertsRepository.findById(alertId);
    if (!alert) return null;
    
    return {
      alertId: alert.alertId,
      dateTime: alert.dateTime,
      status: alert.status,
      description: alert.description,
      associatedAccount: alert.associatedAccount ? {
        accountId: alert.associatedAccount.accountId,
        entityName: alert.associatedAccount.entity?.entityName
      } : null
    };
  }
}
```

### Complete Working DTO
```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AlertResponseDto {
  @ApiProperty({ example: 'ALT123', description: 'Alert ID' })
  alertId: string;

  @ApiProperty({ example: '2023-01-01T10:00:00Z', description: 'Alert timestamp' })
  dateTime: Date;

  @ApiProperty({ example: 'open', description: 'Alert status' })
  status: string;

  @ApiProperty({ example: 'Suspicious transaction detected', description: 'Alert description' })
  description: string;

  @ApiPropertyOptional({ description: 'Associated account information' })
  associatedAccount?: {
    accountId: string;
    entityName?: string;
  };
}
```

### Complete Working Module
```typescript
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { AlertsRepository } from './alerts.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [AlertsController],
  providers: [AlertsService, AlertsRepository],
  exports: [AlertsService, AlertsRepository],
})
export class AlertsModule {}
```

### Register Module in App Module
```typescript
// src/app.module.ts
import { AlertsModule } from './modules/alerts/alerts.module';  // ADD THIS

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule,
    AlertsModule,  // ADD THIS
  ],
  // ... rest unchanged
})
export class AppModule {}
```

## FINAL CHECKLIST

Before completing ANY task:
- [ ] All files created/updated
- [ ] Module imported in `src/app.module.ts`
- [ ] **🚨 MANDATORY:** `npm run build` passes with 0 errors
- [ ] Used camelCase fields (alertId, entityId, NOT snake_case)
- [ ] Used AlertsDatabaseService (NOT direct database imports)
- [ ] Only read operations (no create/update/delete)
- [ ] Complete Swagger documentation on all endpoints
- [ ] Test endpoints at `http://0.0.0.0:3000/api/docs`

**If build fails, fix errors immediately before proceeding.**