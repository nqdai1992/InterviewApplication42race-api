import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import CreateAccountDto from './dto/create-account.dto';
import {
  AthleteAccount,
  AthleteAccountDocument,
} from './schemas/athlete.schema';
import * as strava from 'strava-v3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccountsService {
  private stravaAPI = strava as unknown as strava.Strava;
  constructor(
    @InjectModel(AthleteAccount.name)
    private athleteModel: Model<AthleteAccountDocument>,
    private config: ConfigService,
  ) {}
  async createIfNotExist(createAccountDto: CreateAccountDto) {
    const existedAccount = await this.athleteModel.findOne({
      athleteId: createAccountDto.athleteId,
    });

    if (existedAccount) {
      existedAccount.tokenExpiresAt = createAccountDto.tokenExpiresAt;
      existedAccount.accessToken = createAccountDto.accessToken;
      existedAccount.refreshToken = createAccountDto.refreshToken;
      existedAccount.isConnect = true;
      return existedAccount.save();
    }

    const createdAccount = new this.athleteModel(createAccountDto);
    return createdAccount.save();
  }

  async removeTokens(accessToken: string) {
    return this.athleteModel.findOneAndUpdate(
      { accessToken },
      {
        isConnect: false,
      },
      {
        omitUndefined: true,
      },
    );
  }

  async getAccounts() {
    const athleteAccounts = await this.athleteModel.find();
    const athletes = await Promise.all(
      athleteAccounts.map(async (account) => {
        if (Date.now() >= Number(account.tokenExpiresAt) * 1000) {
          await this.stravaAPI.oauth.refreshToken(account.refreshToken);
        }

        return this.stravaAPI.athlete.get({
          athlete_id: account.athleteId,
          access_token: `Bearer ${account.accessToken}`,
        });
      }),
    );

    return athletes;
  }

  async getAccount(athleteId) {
    const athleteAccount = await this.athleteModel.findOne({ athleteId });
    if (!athleteAccount) {
      throw new NotFoundException('Athlete is not found');
    }

    if (Date.now() >= Number(athleteAccount.tokenExpiresAt) * 1000) {
      await this.stravaAPI.oauth.refreshToken(athleteAccount.refreshToken);
    }

    return this.stravaAPI.athlete.get({
      athlete_id: athleteId,
      access_token: `Bearer ${athleteAccount.accessToken}`,
    });
  }
}
