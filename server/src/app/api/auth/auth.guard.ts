import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { auth } from '../../../lib/auth';
import { AppI18nService } from '../../modules/i18n/app-i18n.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly i18n: AppI18nService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const session = await auth.api.getSession({
      headers: request.headers as any,
    });

    if (!session) {
      throw new UnauthorizedException(
        this.i18n.t('errorMessages.common.unauthorized'),
      );
    }

    // Attach session to request object
    (request as any).session = session;
    (request as any).user = session.user;

    return true;
  }
}
