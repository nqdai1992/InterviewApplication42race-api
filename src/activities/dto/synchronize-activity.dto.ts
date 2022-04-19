import { IsNotEmpty, IsString } from 'class-validator';

export default class SynchronizeActivityDto {
  @IsString()
  @IsNotEmpty()
  activityId: number;

  @IsString()
  athleteId: number;
}
