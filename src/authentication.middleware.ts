import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Model } from 'mongoose';
import { NextFunction } from 'express';
import {
  AthleteAccount,
  AthleteAccountDocument,
} from './accounts/schemas/athlete.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(AthleteAccount.name)
    private athleteModel: Model<AthleteAccountDocument>,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers['accesstoken'];

    if (!accessToken) {
      throw new ForbiddenException('Token is not valid');
    }

    const account = await this.athleteModel.findOne({ accessToken });

    if (!account) {
      throw new ForbiddenException('Token is not valid');
    }

    if (!account.isConnect) {
      throw new ForbiddenException('Please connect the app');
    }

    next();
  }
}
