import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CreateAnalyticsDto, AnalyticsResponseDto } from './analytics.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('events')
  @ApiResponse({ status: 201, description: 'Analytics event created successfully', type: AnalyticsResponseDto })
  async createEvent(@Body() createAnalyticsDto: CreateAnalyticsDto): Promise<AnalyticsResponseDto> {
    return this.analyticsService.createEvent(createAnalyticsDto);
  }

  @Get('events')
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Analytics events retrieved successfully', type: [AnalyticsResponseDto] })
  async getEvents(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
  ): Promise<AnalyticsResponseDto[]> {
    return this.analyticsService.getEvents({ skip, take });
  }

  @Get('events/:id')
  @ApiResponse({ status: 200, description: 'Analytics event retrieved successfully', type: AnalyticsResponseDto })
  @ApiResponse({ status: 404, description: 'Analytics event not found' })
  async getEventById(@Param('id') id: string): Promise<AnalyticsResponseDto> {
    return this.analyticsService.getEventById(id);
  }

  @Get('users/:userId/events')
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'User analytics events retrieved successfully', type: [AnalyticsResponseDto] })
  async getEventsByUser(
    @Param('userId') userId: string,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
  ): Promise<AnalyticsResponseDto[]> {
    return this.analyticsService.getEventsByUser(userId, { skip, take });
  }

  @Get('events/type/:event')
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Analytics events by type retrieved successfully', type: [AnalyticsResponseDto] })
  async getEventsByType(
    @Param('event') event: string,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: number,
  ): Promise<AnalyticsResponseDto[]> {
    return this.analyticsService.getEventsByType(event, { skip, take });
  }
}
