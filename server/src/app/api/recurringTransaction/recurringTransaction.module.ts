import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LedgerAccessModule } from '../../modules/ledgerAccess/ledgerAccess.module.js';
import { CreditModule } from '../credit/credit.module.js';
import { TransactionModule } from '../transaction/transaction.module.js';
import { RecurringTransactionController } from './recurringTransaction.controller.js';
import {
  RecurringTransaction,
  RecurringTransactionSchema,
} from './recurringTransaction.model.js';
import { RecurringTransactionProvider } from './recurringTransaction.provider.js';
import { RecurringTransactionService } from './recurringTransaction.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RecurringTransaction.name, schema: RecurringTransactionSchema },
    ]),
    LedgerAccessModule,
    TransactionModule,
    forwardRef(() => CreditModule),
  ],
  controllers: [RecurringTransactionController],
  providers: [RecurringTransactionService, RecurringTransactionProvider],
  exports: [RecurringTransactionService, RecurringTransactionProvider],
})
export class RecurringTransactionModule {}
