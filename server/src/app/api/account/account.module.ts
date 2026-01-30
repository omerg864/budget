import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LedgerAccessModule } from '../../modules/ledgerAccess/ledgerAccess.module';
import { AccountController } from './account.controller';
import { Account, AccountSchema } from './account.model';
import { AccountProvider } from './account.provider';
import { AccountService } from './account.service';

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
