import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService, TranslateOptions } from 'nestjs-i18n';
import { I18nPath } from './i18n.types';

@Injectable()
export class AppI18nService {
  constructor(private readonly i18n: I18nService) {}

  t(key: I18nPath, options?: TranslateOptions): string {
    const lang = I18nContext.current()?.lang;
    return this.i18n.t(`translations.${key}`, {
      ...options,
      lang: options?.lang || lang,
    });
  }
}
