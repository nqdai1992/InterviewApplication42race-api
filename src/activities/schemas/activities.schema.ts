import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ActivitiesDocument = Activities & Document;

@Schema()
export class Activities {
  @Prop({ required: true, unique: true })
  activityId: number;

  @Prop()
  athleteId: number;

  @Prop()
  type: string;

  @Prop()
  startDate: string;

  @Prop({ type: JSON })
  data: Record<string, unknown>;
}

export const ActivitiesSchema = SchemaFactory.createForClass(Activities);
