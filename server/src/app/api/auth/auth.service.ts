import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'better-auth';
import { EmailService } from '../../modules/email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  public async handleEmailVerification(user: User, url: string): Promise<void> {
    if (!user || !user.id) return;

    await this.emailService.sendVerificationEmail(user.email, user.name, url);
  }

  public async handlePasswordReset(user: User, url: string): Promise<void> {
    if (!user || !user.id) return;

    await this.emailService.sendResetPasswordEmail(user.email, user.name, url);
  }
}
