import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppI18nService } from 'src/app/modules/i18n/app-i18n.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly i18nService: AppI18nService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const validApiKey = this.configService.get<string>('JOB_API_KEY');

    if (!validApiKey) {
      return false;
    }

    if (apiKey !== validApiKey) {
      throw new UnauthorizedException(
        this.i18nService.t('errorMessages.common.invalidApiKey'),
      );
    }

    return true;
  }
}
