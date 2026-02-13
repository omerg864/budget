import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountModule } from '../account/account.module';
import { CurrencyModule } from '../currency/currency.module';
import { LedgerModule } from '../ledger/ledger.module';
import { TransactionModule } from '../transaction/transaction.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import {
  MonthlyAnalytic,
  MonthlyAnalyticSchema,
} from './monthly-analytic.model';
import { MonthlyAnalyticProvider } from './monthly-analytic.provider';
import { YearlyAnalytic, YearlyAnalyticSchema } from './yearly-analytic.model';
import { YearlyAnalyticProvider } from './yearly-analytic.provider';
import { LedgerAccessModule } from 'src/app/modules/ledgerAccess/ledgerAccess.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MonthlyAnalytic.name, schema: MonthlyAnalyticSchema },
      { name: YearlyAnalytic.name, schema: YearlyAnalyticSchema },
    ]),
    TransactionModule,
    LedgerModule,
    CurrencyModule,
    CurrencyModule,
    AccountModule,
    LedgerAccessModule,
    UserModule,
  ],
  controllers: [AnalyticsController],
  providers: [
    AnalyticsService,
    MonthlyAnalyticProvider,
    YearlyAnalyticProvider,
  ],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
