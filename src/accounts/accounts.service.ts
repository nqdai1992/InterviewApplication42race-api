import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import CreateAccountDto from './dto/create-account.dto';
import {
  AthleteAccount,
  AthleteAccountDocument,
} from './schemas/athlete.schema';
import * as strava from 'strava-v3';

@Injectable()
export class AccountsService {
  private stravaAPI = strava as unknown as strava.Strava;
  constructor(
    @InjectModel(AthleteAccount.name)
    private athleteModel: Model<AthleteAccountDocument>,
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

  async getAccounts(accessToken: string) {
    const athleteAccounts = await this.athleteModel.find();
    const athletes = await Promise.all(
      athleteAccounts.map((account) => {
        return this.stravaAPI.athlete.get({
          athlete_id: account.athleteId,
          access_token: accessToken,
        });
      }),
    );

    return athletes;
  }

  async getAccount(accessToken: string, athleteId) {
    const athleteAccount = await this.athleteModel.findOne({ athleteId });
    if (!athleteAccount) {
      throw new NotFoundException('Athlete is not found');
    }
    return this.stravaAPI.athlete.get({
      athlete_id: athleteId,
      access_token: accessToken,
    });
  }
}
