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
import { User } from 'better-auth';
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

  private async createDefaultLedger(user: User, provider: string) {
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

    this.logger.log(
      `User ${user.id} created with default ledger ${ledger.id} with ${provider}`,
    );
  }

  @AfterHook('/sign-up/email')
  async handleNewUserSetup(ctx: AuthHookContext) {
    const user = (ctx.context.returned as any)?.user || ctx.context.returned;

    if (!user || !user.id) return;

    await this.createDefaultLedger(user, 'email');
  }

  @AfterHook('/callback/google')
  async handleGoogleUserSetup(ctx: AuthHookContext) {
    const user = (ctx.context.returned as any)?.user || ctx.context.returned;
    if (!user || !user.id) return;

    await this.createDefaultLedger(user, 'google');
  }
}
