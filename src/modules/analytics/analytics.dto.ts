import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAnalyticsDto {
  @ApiProperty({ example: 'user_login' })
  @IsString()
  event: string;

  @ApiPropertyOptional({ example: 'user123' })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiPropertyOptional({ example: { browser: 'Chrome', os: 'Windows' } })
  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class AnalyticsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  event: string;

  @ApiPropertyOptional()
  userId?: string;

  @ApiPropertyOptional()
  metadata?: any;

  @ApiProperty()
  timestamp: Date;
}
