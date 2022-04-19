import { Controller, Get, Headers } from '@nestjs/common';
import { SynchronizationService } from './synchronization.service';

@Controller('synchronization')
export class SynchronizationController {
  constructor(private synchronizationService: SynchronizationService) {}
  @Get()
  async synchronize(@Headers('accessToken') accessToken: string) {
    return this.synchronizationService.synchronizeActivities(accessToken);
  }
}
