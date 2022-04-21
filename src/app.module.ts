import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './env.validation';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountsModule } from './accounts/accounts.module';
import { ActivitiesModule } from './activities/activities.module';
import { SynchronizationModule } from './synchronization/synchronization.module';
import { AuthenticationMiddleware } from './authentication.middleware';
import { AccountsController } from './accounts/accounts.controller';
import { ActivitiesController } from './activities/activities.controller';
import { SynchronizationController } from './synchronization/synchronization.controller';
import {
  AthleteAccount,
  AthleteAccountSchema,
} from './accounts/schemas/athlete.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    MongooseModule.forRoot(process.env.DB_CONNECTION_STRING),
    MongooseModule.forFeature([
      { name: AthleteAccount.name, schema: AthleteAccountSchema },
    ]),
    AuthModule,
    AccountsModule,
    ActivitiesModule,
    SynchronizationModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(SynchronizationController);
  }
}
