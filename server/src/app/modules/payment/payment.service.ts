import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreditType } from '@shared/constants/credit.constants';
import {
  TransactionPaymentType,
  TransactionType,
} from '@shared/constants/transaction.constants';
import { convertCurrency } from '@shared/services/transaction.shared-service';
import { AccountEntity } from '@shared/types/account.type';
import { CreditEntity } from '@shared/types/credit.type';
import { TransactionEntity } from '@shared/types/transaction.type';
import { AccountService } from '../../api/account/account.service';
import { CreditService } from '../../api/credit/credit.service';
import { CurrencyService } from '../currency/currency.service';
import { AppI18nService } from '../i18n/app-i18n.service';

type PaymentTypeMap = {
  [TransactionPaymentType.CREDIT]: CreditEntity;
  [TransactionPaymentType.ACCOUNT]: AccountEntity;
};

@Injectable()
export class PaymentService {
  constructor(
    private readonly creditService: CreditService,
    private readonly accountService: AccountService,
    private readonly currencyService: CurrencyService,
    private readonly i18n: AppI18nService,
  ) {}

  getOperationByType(
    transactionType: TransactionType,
  ): 'increment' | 'decrement' {
    return transactionType === TransactionType.EXPENSE
      ? 'decrement'
      : 'increment';
  }

  getReversedOperationByType(
    transactionType: TransactionType,
  ): 'increment' | 'decrement' {
    return transactionType === TransactionType.EXPENSE
      ? 'increment'
      : 'decrement';
  }

  async getPayment<T extends TransactionPaymentType>(
    paymentId: string,
    paymentType: T,
  ): Promise<PaymentTypeMap[T] | null> {
    switch (paymentType) {
      case TransactionPaymentType.CREDIT:
        return this.creditService.findOne(paymentId) as Promise<
          PaymentTypeMap[T] | null
        >;
      case TransactionPaymentType.ACCOUNT:
        return this.accountService.findOne(paymentId) as Promise<
          PaymentTypeMap[T] | null
        >;
    }
  }

  async handleCreditPaymentUpdate(
    credit: CreditEntity,
    transaction: TransactionEntity,
  ): Promise<CreditEntity | AccountEntity> {
    const accountConnected = await this.accountService.findOne(
      credit.accountId,
    );
    if (!accountConnected) {
      throw new UnprocessableEntityException(
        this.i18n.t('errorMessages.account.notFound'),
      );
    }
    const operation = this.getOperationByType(transaction.type);
    const exchangeRate = await this.currencyService.getExchangeRate(
      transaction.currency,
      accountConnected.currency,
    );
    if (credit.type === CreditType.CREDIT) {
      const updatedCredit = await this.creditService.updateAmount(
        credit.id,
        operation,
        convertCurrency(transaction.amount, exchangeRate),
      );
      if (!updatedCredit) {
        throw new UnprocessableEntityException(
          this.i18n.t('errorMessages.credit.notFound'),
        );
      }
      return updatedCredit;
    } else {
      const updatedAccount = await this.accountService.updateBalance(
        credit.accountId,
        operation,
        convertCurrency(transaction.amount, exchangeRate),
      );
      if (!updatedAccount) {
        throw new UnprocessableEntityException(
          this.i18n.t('errorMessages.account.notFound'),
        );
      }
      return updatedAccount;
    }
  }

  async handleAccountPaymentUpdate(
    account: AccountEntity,
    transaction: TransactionEntity,
  ): Promise<AccountEntity> {
    const operation = this.getOperationByType(transaction.type);
    const exchangeRate = await this.currencyService.getExchangeRate(
      transaction.currency,
      account.currency,
    );
    const updatedAccount = await this.accountService.updateBalance(
      account.id,
      operation,
      convertCurrency(transaction.amount, exchangeRate),
    );
    if (!updatedAccount) {
      throw new UnprocessableEntityException(
        this.i18n.t('errorMessages.account.notFound'),
      );
    }
    return updatedAccount;
  }

  async handlePaymentUpdateForTransaction<T extends TransactionPaymentType>(
    paymentType: T,
    payment: PaymentTypeMap[T],
    transaction: TransactionEntity,
  ): Promise<AccountEntity | CreditEntity> {
    switch (paymentType) {
      case TransactionPaymentType.CREDIT:
        return this.handleCreditPaymentUpdate(
          payment as CreditEntity,
          transaction,
        );
      case TransactionPaymentType.ACCOUNT:
        return this.handleAccountPaymentUpdate(
          payment as AccountEntity,
          transaction,
        );
    }
  }

  async handlePaymentUpdateForDeleteTransaction<
    T extends TransactionPaymentType,
  >(
    paymentType: T,
    payment: PaymentTypeMap[T],
    transaction: TransactionEntity,
  ): Promise<AccountEntity | CreditEntity> {
    switch (paymentType) {
      case TransactionPaymentType.CREDIT:
        return this.handleCreditPaymentUpdateForDeleteTransaction(
          payment as CreditEntity,
          transaction,
        );
      case TransactionPaymentType.ACCOUNT:
        return this.handleAccountPaymentUpdateForDeleteTransaction(
          payment as AccountEntity,
          transaction,
        );
    }
  }

  async handleCreditPaymentUpdateForDeleteTransaction(
    credit: CreditEntity,
    transaction: TransactionEntity,
  ): Promise<CreditEntity | AccountEntity> {
    const accountConnected = await this.accountService.findOne(
      credit.accountId,
    );
    if (!accountConnected) {
      throw new UnprocessableEntityException(
        this.i18n.t('errorMessages.account.notFound'),
      );
    }
    const operation = this.getReversedOperationByType(transaction.type);
    const exchangeRate = await this.currencyService.getExchangeRate(
      transaction.currency,
      accountConnected.currency,
    );
    if (credit.type === CreditType.CREDIT) {
      const updatedCredit = await this.creditService.updateAmount(
        credit.id,
        operation,
        convertCurrency(transaction.amount, exchangeRate),
      );
      if (!updatedCredit) {
        throw new UnprocessableEntityException(
          this.i18n.t('errorMessages.credit.notFound'),
        );
      }
      return updatedCredit;
    } else {
      const updatedAccount = await this.accountService.updateBalance(
        credit.accountId,
        operation,
        convertCurrency(transaction.amount, exchangeRate),
      );
      if (!updatedAccount) {
        throw new UnprocessableEntityException(
          this.i18n.t('errorMessages.account.notFound'),
        );
      }
      return updatedAccount;
    }
  }

  async handleAccountPaymentUpdateForDeleteTransaction(
    account: AccountEntity,
    transaction: TransactionEntity,
  ): Promise<AccountEntity> {
    const operation = this.getReversedOperationByType(transaction.type);
    const exchangeRate = await this.currencyService.getExchangeRate(
      transaction.currency,
      account.currency,
    );
    const updatedAccount = await this.accountService.updateBalance(
      account.id,
      operation,
      convertCurrency(transaction.amount, exchangeRate),
    );
    if (!updatedAccount) {
      throw new UnprocessableEntityException(
        this.i18n.t('errorMessages.account.notFound'),
      );
    }
    return updatedAccount;
  }
}
