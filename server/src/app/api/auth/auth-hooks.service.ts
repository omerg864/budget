import { Injectable, Logger } from '@nestjs/common';
import { SupportedCurrencies } from '@shared/constants/currency.constants';
import {
  LedgerAccessRole,
  SupportedIcons,
} from '@shared/constants/ledger.constants';
import {
  AfterHook,
  type AuthHookContext,
  Hook,
} from '@thallesp/nestjs-better-auth';
import { EmailService } from '../../modules/email/email.service';
import { AppI18nService } from '../../modules/i18n/app-i18n.service';
import { LedgerAccessService } from '../../modules/ledgerAccess/ledgerAccess.service';
import { LedgerService } from '../ledger/ledger.service';
import { UserService } from '../user/user.service';

@Hook() // Marks this class as a Better Auth hook provider
@Injectable()
export class AuthHookService {
  private readonly logger = new Logger(AuthHookService.name);

  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly ledgerService: LedgerService,
    private readonly ledgerAccessService: LedgerAccessService,
    private readonly i18n: AppI18nService,
  ) {}

  // Hook 1: Run logic before a user signs up
  @AfterHook('/sign-up/email')
  @AfterHook('/callback/google')
  async handleNewUserSetup(ctx: AuthHookContext) {
    // Better Auth returns the user object in the response body or context
    const user = (ctx.context.returned as any)?.user || ctx.context.returned;

    if (!user || !user.id) return;

    const ledger = await this.ledgerService.create({
      name: this.i18n.t('variables.defaultLedgerName'),
      currency: SupportedCurrencies.ILS,
      icon: SupportedIcons.Home,
      color: '#FF0000',
    });

    await this.ledgerAccessService.create({
      ledgerId: ledger.id,
      userId: user.id,
      role: LedgerAccessRole.OWNER,
    });

    await this.userService.update(user.id, {
      defaultLedgerId: ledger.id,
    });

    this.logger.log(`User ${user.id} created with default ledger ${ledger.id}`);
  }
}
