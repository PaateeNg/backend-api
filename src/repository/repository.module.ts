import { Module } from '@nestjs/common';
import { RepositoryService } from './repository.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RepositoryService],
  exports: [RepositoryService],
})
export class RepositoryModule {}
