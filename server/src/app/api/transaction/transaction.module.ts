import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LedgerAccessModule } from '../../modules/ledgerAccess/ledgerAccess.module.js';
import { AccountModule } from '../account/account.module.js';
import { CreditModule } from '../credit/credit.module.js';
import { UserModule } from '../user/user.module.js';
import { TransactionController } from './transaction.controller.js';
import { Transaction, TransactionSchema } from './transaction.model.js';
import { TransactionProvider } from './transaction.provider.js';
import { TransactionService } from './transaction.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    LedgerAccessModule,
    AccountModule,
    UserModule,
    CreditModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionProvider],
  exports: [TransactionService],
})
export class TransactionModule {}
