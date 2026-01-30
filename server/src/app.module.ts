import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { AccountModule } from './app/api/account/account.module';
import { AuthModule } from './app/api/auth/auth.module';
import { CreditModule } from './app/api/credit/credit.module';
import { LedgerModule } from './app/api/ledger/ledger.module';
import { RecurringTransactionModule } from './app/api/recurringTransaction/recurringTransaction.module';
import { TransactionModule } from './app/api/transaction/transaction.module';
import { UserModule } from './app/api/user/user.module';
import { AppI18nModule } from './app/modules/i18n/app-i18n.module';
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
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, './locale/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] }, // ?lang=es
        AcceptLanguageResolver, // Accept-Language header
        new HeaderResolver(['x-custom-lang']), // x-custom-lang header
      ],
    }),
    AppI18nModule,
    AuthModule,
    UserModule,
    LedgerModule,
    AccountModule,
    CreditModule,
    TransactionModule,
    RecurringTransactionModule,
  ],
})
export class AppModule {}
