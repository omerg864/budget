import { Module } from '@nestjs/common';
import { AccountModule } from '../../api/account/account.module';
import { CreditModule } from '../../api/credit/credit.module';
import { PaymentService } from './payment.service';

@Module({
  imports: [AccountModule, CreditModule],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
