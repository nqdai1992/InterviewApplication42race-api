import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AthleteAccountDocument = AthleteAccount & Document;

@Schema()
export class AthleteAccount {
  @Prop({ required: true, unique: true })
  athleteId: string;

  @Prop({ default: true })
  isConnect: boolean;

  @Prop({ default: undefined })
  accessToken: string;

  @Prop({ default: undefined })
  refreshToken: string;

  @Prop({ default: undefined })
  tokenExpiresAt: string;
}

export const AthleteAccountSchema =
  SchemaFactory.createForClass(AthleteAccount);
