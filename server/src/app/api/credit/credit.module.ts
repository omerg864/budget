import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LedgerAccessModule } from '../../modules/ledgerAccess/ledgerAccess.module';
import { AccountModule } from '../account/account.module';
import { UserModule } from '../user/user.module';
import { CreditController } from './credit.controller';
import { Credit, CreditSchema } from './credit.model';
import { CreditProvider } from './credit.provider';
import { CreditService } from './credit.service';

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
