import {
  Controller,
  ForbiddenException,
  Get,
  Headers,
  Query,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { AuthCodeDTO } from './dto/authCode.dto';

@Controller('')
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {}
  @Get('connect')
  redirectToStravaIDP(@Res() res: Response, @Query() query: AuthDTO) {
    const clientId = this.configService.get<string>('STRAVA_CLIENT_ID');
    const exchangeTokenURL =
      this.configService.get<string>('APP_EXCHANGE_TOKEN_URL') +
      `?client_exchange_code_uri=${query.redirect_uri}`;
    const url = `http://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${exchangeTokenURL}&approval_prompt=force&scope=activity:read_all`;

    res.redirect(url);
  }

  @Get('exchange_token')
  async getTokenAutheticatedInfo(
    @Query() query: AuthCodeDTO,
    @Res() res: Response,
  ) {
    const authInfo = await this.authService.getAuthInfo(query.code);
    res.redirect(
      query.client_exchange_code_uri + `?accessToken=${authInfo.accessToken}`,
    );
  }

  @Get('disconnect')
  async disconnect(@Headers('accessToken') accessToken: string) {
    if (!accessToken) {
      throw new ForbiddenException('Credentials incorrect');
    }

    this.authService.disconnect(accessToken);
  }
}
