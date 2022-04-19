import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AccountsModule } from 'src/accounts/accounts.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [HttpModule, AccountsModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
