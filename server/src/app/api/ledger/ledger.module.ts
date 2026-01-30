import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LedgerAccessModule } from '../../modules/ledgerAccess/ledgerAccess.module';
import { AccountModule } from '../account/account.module';
import { CreditModule } from '../credit/credit.module';
import { RecurringTransactionModule } from '../recurringTransaction/recurringTransaction.module';
import { TransactionModule } from '../transaction/transaction.module';
import { LedgerController } from './ledger.controller';
import { Ledger, LedgerSchema } from './ledger.model';
import { LedgerProvider } from './ledger.provider';
import { LedgerService } from './ledger.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ledger.name, schema: LedgerSchema }]),
    LedgerAccessModule,
    TransactionModule,
    RecurringTransactionModule,
    CreditModule,
    AccountModule,
  ],
  controllers: [LedgerController],
  providers: [LedgerService, LedgerProvider],
  exports: [LedgerService],
})
export class LedgerModule {}
