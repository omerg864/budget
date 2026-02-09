import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ejs from 'ejs';
import { AppI18nService } from '../i18n/app-i18n.service';

import { createTransport, Transporter } from 'nodemailer';
import * as path from 'path';

type SendEmailOptions = {
  receiver: string | string[];
  subject: string;
  text?: string;
  html?: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly i18n: AppI18nService,
  ) {
    this.transporter = createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: Number(this.configService.get<string>('EMAIL_PORT')),
      secure: this.configService.get<string>('EMAIL_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('EMAIL_USERNAME'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  private async sendEmail({
    receiver,
    subject,
    text,
    html,
  }: SendEmailOptions): Promise<boolean> {
    const EMAIL_ADDRESS = this.configService.get<string>('EMAIL_ADDRESS');
    if (!EMAIL_ADDRESS) {
      this.logger.error(
        'Missing email configuration in environment variables.',
      );
      return false;
    }

    const mailOptions = {
      from: `"Budget App" <${EMAIL_ADDRESS}>`,
      to: Array.isArray(receiver) ? receiver.join(',') : receiver,
      subject,
      text,
      html,
    };

    let success = false;

    for (let attempt = 1; attempt <= 3 && !success; attempt++) {
      try {
        await this.transporter.sendMail(mailOptions);
        success = true;
      } catch (error) {
        this.logger.error(`Email send failed (attempt ${attempt}):`, error);
        if (attempt < 3) {
          this.logger.debug(`Retrying email send to: ${mailOptions.to}`);
        }
      }
    }

    return success;
  }

  async sendLedgerShareEmail(
    email: string,
    ledgerName: string,
    link: string,
    name: string,
  ): Promise<boolean> {
    const templatePath = path.join(
      process.cwd(),
      './src/app/modules/email/templates/share-ledger.ejs',
    );

    const html = await ejs.renderFile(templatePath, {
      ledgerName,
      link,
      name,
      t: (key: string, args?: any) => this.i18n.t(key as any, { args }),
    });

    return this.sendEmail({
      receiver: email,
      subject: this.i18n.t('templates.shareLedger.subject', {
        args: { ledgerName },
      }),
      html,
    });
  }

  async sendVerificationEmail(
    email: string,
    username: string,
    link: string,
  ): Promise<boolean> {
    const templatePath = path.join(
      process.cwd(),
      './src/app/modules/email/templates/verification.ejs',
    );

    const html = await ejs.renderFile(templatePath, {
      name: username,
      link,
      t: (key: string, args?: any) => this.i18n.t(key as any, { args }),
    });

    return this.sendEmail({
      receiver: email,
      subject: this.i18n.t('templates.verification.subject'),
      html,
    });
  }
}
