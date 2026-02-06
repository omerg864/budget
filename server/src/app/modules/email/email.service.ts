import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as ejs from 'ejs';
import { AppI18nService } from '../i18n/app-i18n.service';

import { createTransport } from 'nodemailer';
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

  constructor(
    private readonly configService: ConfigService,
    private readonly i18n: AppI18nService,
  ) {}

  private async sendEmail({
    receiver,
    subject,
    text,
    html,
  }: SendEmailOptions): Promise<boolean> {
    const EMAIL_SERVICE = this.configService.get<string>('EMAIL_SERVICE');
    const EMAIL_USERNAME = this.configService.get<string>('EMAIL_USERNAME');
    const EMAIL_PASSWORD = this.configService.get<string>('EMAIL_PASSWORD');
    const EMAIL_ADDRESS = this.configService.get<string>('EMAIL_ADDRESS');
    if (
      !EMAIL_SERVICE ||
      !EMAIL_USERNAME ||
      !EMAIL_PASSWORD ||
      !EMAIL_ADDRESS
    ) {
      this.logger.error(
        'Missing email configuration in environment variables.',
      );
      return false;
    }

    const transporter = createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: EMAIL_ADDRESS,
      to: Array.isArray(receiver) ? receiver.join(',') : receiver,
      subject,
      text,
      html,
    };

    let success = false;

    for (let attempt = 1; attempt <= 3 && !success; attempt++) {
      try {
        await transporter.sendMail(mailOptions);
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
      'dist/server/src/templates/share-ledger.ejs',
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
}
