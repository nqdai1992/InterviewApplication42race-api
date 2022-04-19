import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ActivitiesService } from './activities.service';

@Controller('activities')
export class ActivitiesController {
  constructor(private activitiesService: ActivitiesService) {}
  @Get()
  async getActivities(@Query() query: any) {
    return this.activitiesService.getActivities(query);
  }

  @Get(':activityId')
  async getActivity(@Param('activityId') activityId: string) {
    return this.activitiesService.getActivity(activityId);
  }

  @Delete(':activityId')
  async deleteActivity(@Param('activityId') activityId: string) {
    return this.activitiesService.deleteActivity(activityId);
  }
}
