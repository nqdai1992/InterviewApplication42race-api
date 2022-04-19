import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import SynchronizeActivityDto from './dto/synchronize-activity.dto';
import { Activities, ActivitiesDocument } from './schemas/activities.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activities.name)
    private activitiesModel: Model<ActivitiesDocument>,
  ) {}
  async synchronizeActivities(activities: SynchronizeActivityDto[]) {
    try {
      await Promise.all(
        activities.map(async (activity) => {
          const existedActivity = await this.activitiesModel.findOne({
            activityId: activity.activityId,
          });
          if (!existedActivity) {
            const newActivity = new this.activitiesModel(activity);
            return newActivity.save();
          }
        }),
      );
    } catch (err) {
      console.log(err);
    }
  }

  async getActivities(query: { athleteID?: string; type?: string } = {}) {
    const activities = await this.activitiesModel
      .find(query)
      .sort({ startDate: 'desc' });

    return activities.map((activity) => activity.data);
  }

  async getActivity(activityId: string) {
    const activity = await this.activitiesModel.findOne({ activityId });

    if (!activity) {
      throw new NotFoundException('Activity is not found');
    }

    return activity;
  }

  async deleteActivity(activityId: string) {
    const activity = await this.activitiesModel.deleteOne({ activityId });

    if (!activity.deletedCount) {
      throw new NotFoundException('Activity is not found');
    }

    return activity;
  }
}
