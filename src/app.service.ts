import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { message: string; timestamp: string } {
    return {
      message: 'NestJS Template API is running',
      timestamp: new Date().toISOString(),
    };
  }
}
