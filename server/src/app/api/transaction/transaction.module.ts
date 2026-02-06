import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrencyModule } from '../../modules/currency/currency.module';
import { LedgerAccessModule } from '../../modules/ledgerAccess/ledgerAccess.module';
import { PaymentModule } from '../../modules/payment/payment.module';
import { AccountModule } from '../account/account.module';
import { CreditModule } from '../credit/credit.module';
import { LedgerModule } from '../ledger/ledger.module';
import { UserModule } from '../user/user.module';
import { TransactionController } from './transaction.controller';
import { Transaction, TransactionSchema } from './transaction.model';
import { TransactionProvider } from './transaction.provider';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    LedgerAccessModule,
    AccountModule,
    UserModule,
    UserModule,
    CreditModule,
    PaymentModule,
    AccountModule,
    CurrencyModule,
    forwardRef(() => LedgerModule),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionProvider],
  exports: [TransactionService],
})
export class TransactionModule {}
