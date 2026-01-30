import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LedgerAccessModule } from '../../modules/ledgerAccess/ledgerAccess.module';
import { PaymentModule } from '../../modules/payment/payment.module';
import { CreditModule } from '../credit/credit.module';
import { TransactionModule } from '../transaction/transaction.module';
import { RecurringTransactionController } from './recurringTransaction.controller';
import {
  RecurringTransaction,
  RecurringTransactionSchema,
} from './recurringTransaction.model';
import { RecurringTransactionProvider } from './recurringTransaction.provider';
import { RecurringTransactionService } from './recurringTransaction.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RecurringTransaction.name, schema: RecurringTransactionSchema },
    ]),
    LedgerAccessModule,
    TransactionModule,
    PaymentModule,
    forwardRef(() => CreditModule),
  ],
  controllers: [RecurringTransactionController],
  providers: [RecurringTransactionService, RecurringTransactionProvider],
  exports: [RecurringTransactionService, RecurringTransactionProvider],
})
export class RecurringTransactionModule {}
