import { Injectable } from '@nestjs/common';
import { TransactionPaymentType } from '@shared/constants/transaction.constants';
import { AccountEntity } from '@shared/types/account.type.js';
import { CreditEntity } from '@shared/types/credit.type.js';
import { AccountService } from '../../api/account/account.service';
import { CreditService } from '../../api/credit/credit.service';

type PaymentTypeMap = {
  [TransactionPaymentType.CREDIT]: CreditEntity;
  [TransactionPaymentType.ACCOUNT]: AccountEntity;
};

@Injectable()
export class PaymentService {
  constructor(
    private readonly creditService: CreditService,
    private readonly accountService: AccountService,
  ) {}

  async getPayment<T extends TransactionPaymentType>(
    paymentId: string,
    paymentType: T,
  ): Promise<PaymentTypeMap[T] | null> {
    switch (paymentType) {
      case TransactionPaymentType.CREDIT:
        // Cast as unknown first, then to the generic return type
        return this.creditService.findOne(paymentId) as unknown as Promise<
          PaymentTypeMap[T] | null
        >;
      case TransactionPaymentType.ACCOUNT:
        return this.accountService.findOne(paymentId) as unknown as Promise<
          PaymentTypeMap[T] | null
        >;
    }
    return null;
  }
}
