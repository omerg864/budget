import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '../../../lib/auth';
import { EmailModule } from '../../modules/email/email.module';
import { AppI18nModule } from '../../modules/i18n/app-i18n.module';
import { LedgerAccessModule } from '../../modules/ledgerAccess/ledgerAccess.module';
import { LedgerModule } from '../ledger/ledger.module';
import { UserModule } from '../user/user.module';
import { AuthHookService } from './auth-hooks.service';

@Module({
  imports: [
    UserModule,
    LedgerModule,
    LedgerAccessModule,
    EmailModule,
    AppI18nModule,
    BetterAuthModule.forRoot({ auth }),
  ],
  controllers: [],
  providers: [AuthHookService],
  exports: [],
})
export class AuthModule {}
