import { Injectable, NotFoundException } from '@nestjs/common';
import { AnalyticsRepository } from './analytics.repository';
import { CreateAnalyticsDto, AnalyticsResponseDto } from './analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  async createEvent(createAnalyticsDto: CreateAnalyticsDto): Promise<AnalyticsResponseDto> {
    return this.analyticsRepository.create(createAnalyticsDto);
  }

  async getEventById(id: string): Promise<AnalyticsResponseDto> {
    const event = await this.analyticsRepository.findById(id);
    if (!event) {
      throw new NotFoundException('Analytics event not found');
    }
    return event;
  }

  async getEvents(params?: {
    skip?: number;
    take?: number;
  }): Promise<AnalyticsResponseDto[]> {
    return this.analyticsRepository.findMany(params);
  }

  async getEventsByUser(userId: string, params?: {
    skip?: number;
    take?: number;
  }): Promise<AnalyticsResponseDto[]> {
    return this.analyticsRepository.findByUserId(userId, params);
  }

  async getEventsByType(event: string, params?: {
    skip?: number;
    take?: number;
  }): Promise<AnalyticsResponseDto[]> {
    return this.analyticsRepository.findByEvent(event, params);
  }
}
