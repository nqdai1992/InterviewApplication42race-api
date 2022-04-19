import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private accountsService: AccountsService,
  ) {}

  async getAuthInfo(code: string) {
    const clientId = this.configService.get<string>('STRAVA_CLIENT_ID');
    const clientSecret = this.configService.get<string>('STRAVA_CLIENT_SECRET');
    const url = ` https://www.strava.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code`;
    try {
      const { data } = await this.httpService.axiosRef.post<{
        access_token: string;
        refresh_token: string;
        expires_at: string;
        athlete: { id: string };
      }>(url);

      const createdAccount = await this.accountsService.createIfNotExist({
        athleteId: data.athlete.id,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenExpiresAt: data.expires_at,
      });

      return createdAccount;
    } catch (err) {
      console.log(url);
      console.log(err.message);
    }
  }

  async disconnect(accessToken: string) {
    return this.accountsService.removeTokens(accessToken);
  }
}
