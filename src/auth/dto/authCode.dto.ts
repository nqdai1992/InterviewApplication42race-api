import { IsNotEmpty, IsString } from 'class-validator';

export class AuthCodeDTO {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  client_exchange_code_uri: string;

  @IsString()
  @IsNotEmpty()
  scope: string;
}
