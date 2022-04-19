import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AthleteAccount, AthleteAccountSchema } from './schemas/athlete.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AthleteAccount.name, schema: AthleteAccountSchema },
    ]),
  ],
  providers: [AccountsService],
  controllers: [AccountsController],
  exports: [AccountsService],
})
export class AccountsModule {}
