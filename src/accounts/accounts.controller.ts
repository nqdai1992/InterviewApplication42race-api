import { Controller, Get, Headers, Param } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private accountService: AccountsService) {}
  @Get()
  async getAccounts(@Headers('accessToken') accessToken: string) {
    return this.accountService.getAccounts(accessToken);
  }

  @Get(':athleteId')
  async getAccount(
    @Headers('accessToken') accessToken: string,
    @Param('athleteId') athleteId: string,
  ) {
    return this.accountService.getAccount(accessToken, athleteId);
  }
}
