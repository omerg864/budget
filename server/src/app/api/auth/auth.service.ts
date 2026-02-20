import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupportedCurrencies } from '@shared/constants/currency.constants';
import {
  LedgerAccessRole,
  SupportedIcons,
} from '@shared/constants/ledger.constants';
import { User } from 'better-auth';
import { EmailService } from '../../modules/email/email.service';
import { AppI18nService } from '../../modules/i18n/app-i18n.service';
import { LedgerAccessService } from '../../modules/ledgerAccess/ledgerAccess.service';
import { LedgerService } from '../ledger/ledger.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly ledgerService: LedgerService,
    private readonly ledgerAccessService: LedgerAccessService,
    private readonly i18n: AppI18nService,
  ) {}

  public async handleEmailVerification(user: User, url: string): Promise<void> {
    if (!user || !user.id) return;

    await this.emailService.sendVerificationEmail(user.email, user.name, url);
  }

  public async handlePasswordReset(user: User, url: string): Promise<void> {
    if (!user || !user.id) return;

    await this.emailService.sendResetPasswordEmail(user.email, user.name, url);
  }

  public async createDefaultLedger(user: User) {
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
