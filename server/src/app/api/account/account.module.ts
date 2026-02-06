import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CurrencyModule } from '../../modules/currency/currency.module';
import { LedgerAccessModule } from '../../modules/ledgerAccess/ledgerAccess.module';
import { AccountController } from './account.controller';
import { Account, AccountSchema } from './account.model';
import { AccountProvider } from './account.provider';
import { AccountService } from './account.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    LedgerAccessModule,
    CurrencyModule,
  ],
  controllers: [AccountController],
  providers: [AccountService, AccountProvider],
  exports: [AccountService],
})
export class AccountModule {}
