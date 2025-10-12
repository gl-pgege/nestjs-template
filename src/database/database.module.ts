import { Global, Module } from '@nestjs/common';
import { PrimaryDatabaseService } from './primary-database.service';
import { SecondaryDatabaseService } from './secondary-database.service';

@Global()
@Module({
  providers: [PrimaryDatabaseService, SecondaryDatabaseService],
  exports: [PrimaryDatabaseService, SecondaryDatabaseService],
})
export class DatabaseModule {}
