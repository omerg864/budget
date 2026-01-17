import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { auth } from '../../../lib/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const session = await auth.api.getSession({
      headers: request.headers as any,
    });

    if (!session) {
      throw new UnauthorizedException('Not authenticated');
    }

    // Attach session to request object
    (request as any).session = session;
    (request as any).user = session.user;

    return true;
  }
}
