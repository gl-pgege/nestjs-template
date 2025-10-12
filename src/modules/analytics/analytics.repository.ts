import { Injectable } from '@nestjs/common';
import { Analytics } from '@prisma/secondary-client';
import { SecondaryDatabaseService } from '@/database/secondary-database.service';
import { BaseRepository } from '@/common/base-repository';
import { CreateAnalyticsDto } from './analytics.dto';

@Injectable()
export class AnalyticsRepository extends BaseRepository<Analytics, CreateAnalyticsDto, never> {
  constructor(private readonly prisma: SecondaryDatabaseService) {
    super();
  }

  async create(data: CreateAnalyticsDto): Promise<Analytics> {
    return this.prisma.analytics.create({ data });
  }

  async findById(id: string): Promise<Analytics | null> {
    return this.prisma.analytics.findUnique({
      where: { id },
    });
  }

  async findMany(params?: {
    skip?: number;
    take?: number;
    where?: any;
  }): Promise<Analytics[]> {
    return this.prisma.analytics.findMany(params);
  }

  async findByUserId(userId: string, params?: {
    skip?: number;
    take?: number;
  }): Promise<Analytics[]> {
    return this.prisma.analytics.findMany({
      where: { userId },
      ...params,
    });
  }

  async findByEvent(event: string, params?: {
    skip?: number;
    take?: number;
  }): Promise<Analytics[]> {
    return this.prisma.analytics.findMany({
      where: { event },
      ...params,
    });
  }

  async update(): Promise<never> {
    throw new Error('Analytics records are immutable');
  }

  async delete(): Promise<never> {
    throw new Error('Analytics records cannot be deleted');
  }
}
