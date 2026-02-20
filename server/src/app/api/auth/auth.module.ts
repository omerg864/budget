import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from '../../modules/email/email.module';
import { AppI18nModule } from '../../modules/i18n/app-i18n.module';
import { LedgerAccessModule } from '../../modules/ledgerAccess/ledgerAccess.module';
import { LedgerModule } from '../ledger/ledger.module';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    EmailModule,
    ConfigModule,
    UserModule,
    LedgerModule,
    LedgerAccessModule,
    AppI18nModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
