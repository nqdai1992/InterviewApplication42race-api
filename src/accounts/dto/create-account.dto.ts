import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  athleteId: string;

  @IsString()
  accessToken: string | null;

  @IsString()
  refreshToken: string;

  @IsString()
  tokenExpiresAt: string;
}
