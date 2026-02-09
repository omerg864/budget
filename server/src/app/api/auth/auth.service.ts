import { Injectable, Logger } from '@nestjs/common';
import { User } from 'better-auth';
import { EmailService } from '../../modules/email/email.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly emailService: EmailService) {}

  public async handleEmailVerification(user: User, url: string): Promise<void> {
    if (!user || !user.id) return;

    await this.emailService.sendVerificationEmail(user.email, user.name, url);
  }
}
