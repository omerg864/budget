import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { CreditModule } from '../credit/credit.module';
import { LedgerModule } from '../ledger/ledger.module';
import { RecurringTransactionModule } from '../recurringTransaction/recurringTransaction.module';
import { TransactionModule } from '../transaction/transaction.module';
import { JobController } from './job.controller';
import { JobService } from './job.service';

@Module({
  imports: [
    CreditModule,
    AccountModule,
    LedgerModule,
    TransactionModule,
    RecurringTransactionModule,
    AnalyticsModule,
  ],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
