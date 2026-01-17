import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from './app/api/account/account.module';
import { AuthModule } from './app/api/auth/auth.module';
import { CreditModule } from './app/api/credit/credit.module';
import { LedgerModule } from './app/api/ledger/ledger.module';
import { UserModule } from './app/api/user/user.module';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import cloudConfig from './config/cloud.config';
import dbConfig from './config/db.config';
import emailConfig from './config/email.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, cloudConfig, dbConfig, emailConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log('Connecting to MongoDB');
        return {
          uri: configService.get<string>('MONGO_URI'),
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    LedgerModule,
    AccountModule,
    CreditModule,
  ],
})
export class AppModule {}
