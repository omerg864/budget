import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LedgerAccessModule } from '../../modules/ledgerAccess/ledgerAccess.module.js';
import { AccountModule } from '../account/account.module.js';
import { CreditModule } from '../credit/credit.module.js';
import { RecurringTransactionModule } from '../recurringTransaction/recurringTransaction.module.js';
import { TransactionModule } from '../transaction/transaction.module.js';
import { LedgerController } from './ledger.controller.js';
import { Ledger, LedgerSchema } from './ledger.model.js';
import { LedgerProvider } from './ledger.provider.js';
import { LedgerService } from './ledger.service.js';
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
