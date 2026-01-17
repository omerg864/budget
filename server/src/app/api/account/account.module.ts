import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LedgerAccessModule } from '../../modules/ledgerAccess/ledgerAccess.module.js';
import { AccountController } from './account.controller.js';
import { Account, AccountSchema } from './account.model.js';
import { AccountProvider } from './account.provider.js';
import { AccountService } from './account.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
    LedgerAccessModule,
  ],
  controllers: [AccountController],
  providers: [AccountService, AccountProvider],
  exports: [AccountService],
})
export class AccountModule {}
