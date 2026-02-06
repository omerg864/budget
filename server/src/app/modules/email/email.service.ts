import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';

type SendEmailOptions = {
  receiver: string | string[];
  subject: string;
  text?: string;
  html?: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

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
}
