import { Global, Module } from '@nestjs/common';
import { AppI18nService } from './app-i18n.service';

@Global()
@Module({
  providers: [AppI18nService],
  exports: [AppI18nService],
})
export class AppI18nModule {}
