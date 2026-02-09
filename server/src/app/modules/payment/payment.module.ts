import { Module } from '@nestjs/common';
import { AccountModule } from '../../api/account/account.module';
import { CreditModule } from '../../api/credit/credit.module';
import { CurrencyModule } from '../currency/currency.module';
import { AppI18nModule } from '../i18n/app-i18n.module';
import { PaymentService } from './payment.service';

@Module({
  imports: [AccountModule, CreditModule, CurrencyModule, AppI18nModule],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
