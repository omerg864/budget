import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LedgerAccessModule } from '../../modules/ledgerAccess/ledgerAccess.module.js';
import { AccountModule } from '../account/account.module.js';
import { UserModule } from '../user/user.module.js';
import { CreditController } from './credit.controller.js';
import { Credit, CreditSchema } from './credit.model.js';
import { CreditProvider } from './credit.provider.js';
import { CreditService } from './credit.service.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Credit.name, schema: CreditSchema }]),
    LedgerAccessModule,
    AccountModule,
    UserModule,
  ],
  controllers: [CreditController],
  providers: [CreditService, CreditProvider],
  exports: [CreditService],
})
export class CreditModule {}
