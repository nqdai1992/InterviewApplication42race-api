import { Controller, Get, Param } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private accountService: AccountsService) {}
  @Get()
  async getAccounts() {
    return this.accountService.getAccounts();
  }

  @Get(':athleteId')
  async getAccount(@Param('athleteId') athleteId: string) {
    return this.accountService.getAccount(athleteId);
  }
}
