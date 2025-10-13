import { Global, Module } from '@nestjs/common';
import { AlertsDatabaseService } from './alerts-database.service';

@Global()
@Module({
  providers: [AlertsDatabaseService],
  exports: [AlertsDatabaseService],
})
export class DatabaseModule {}
