import { Module } from '@nestjs/common';
import { SynchronizationService } from './synchronization.service';
import { SynchronizationController } from './synchronization.controller';

@Module({
  providers: [SynchronizationService],
  controllers: [SynchronizationController],
})
export class SynchronizationModule {}
