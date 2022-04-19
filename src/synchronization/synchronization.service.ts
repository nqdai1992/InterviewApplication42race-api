import { Injectable } from '@nestjs/common';
import { Strava } from 'strava-v3';
import * as strava from 'strava-v3';
import { ActivitiesService } from 'src/activities/activities.service';

@Injectable()
export class SynchronizationService {
  private stravaAPI = strava as unknown as Strava;
  constructor(private activitiesService: ActivitiesService) {}
  async synchronizeActivities(accessToken: string) {
    const stravaClient = new this.stravaAPI.client(accessToken);
    const today = new Date();
    const priorDate = new Date(new Date().setDate(today.getDate() - 3));

    const activities = await stravaClient.athlete.listActivities({
      start_date_local: priorDate.toISOString(),
    });

    this.activitiesService.synchronizeActivities(
      activities.map((item) => {
        return {
          activityId: item.id,
          athleteId: item.athlete.id,
          type: item.type,
          startDate: item.start_date,
          data: item,
        };
      }),
    );
  }
}
