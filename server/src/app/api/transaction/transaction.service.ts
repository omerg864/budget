import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import {
  TransactionPaymentType,
  TransactionType,
} from '@shared/constants/transaction.constants';
import {
  convertCurrency,
  getTransactionActualAmount,
} from '@shared/services/transaction.shared-service';
import { AccountEntity } from '@shared/types/account.type';
import { CreditEntity } from '@shared/types/credit.type';
import { forEachLimit } from 'async';
import { TransactionEntity } from '../../../../../shared/types/transaction.type';
import { CurrencyService } from '../../modules/currency/currency.service';
import { AppI18nService } from '../../modules/i18n/app-i18n.service';
import { PaymentService } from '../../modules/payment/payment.service';
import { AccountService } from '../account/account.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { TransactionProvider } from './transaction.provider';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionProvider: TransactionProvider,
    private readonly accountService: AccountService,
    private readonly currencyService: CurrencyService,
    private readonly paymentService: PaymentService,
    private readonly analyticsService: AnalyticsService,
    private readonly i18n: AppI18nService,
  ) {}

  async create(
    data: Omit<TransactionEntity, 'id' | 'createdAt' | 'updatedAt'>,
    payment: AccountEntity | CreditEntity,
  ): Promise<TransactionEntity> {
    await this.paymentService.handlePaymentUpdateForTransaction(
      data.paymentType,
      payment,
      data as TransactionEntity,
    );
    await this.analyticsService.updateAnalyticsForTransaction(
      'create',
      undefined,
      data as TransactionEntity,
    );
    return this.transactionProvider.create(data);
  }

  async createMany(
    data: Omit<TransactionEntity, 'id' | 'createdAt' | 'updatedAt'>[],
  ): Promise<TransactionEntity[]> {
    await forEachLimit(data, 10, async (transaction) => {
      const payment = await this.paymentService.getPayment(
        transaction.paymentId,
        transaction.paymentType,
      );
      if (!payment) {
        throw new UnprocessableEntityException(
          this.i18n.t('errorMessages.payment.notFound'),
        );
      }
      await this.paymentService.handlePaymentUpdateForTransaction(
        transaction.paymentType,
        payment,
        transaction as TransactionEntity,
      );
      await this.analyticsService.updateAnalyticsForTransaction(
        'create',
        undefined,
        transaction as TransactionEntity,
      );
    });
    return this.transactionProvider.createMany(data);
  }

  async findByLedgerId(
    ledgerId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<TransactionEntity[]> {
    return this.transactionProvider.findByLedgerId(
      ledgerId,
      startDate,
      endDate,
    );
  }

  async findByCreditId(
    creditId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<TransactionEntity[]> {
    return this.transactionProvider.findByCreditId(
      creditId,
      startDate,
      endDate,
    );
  }

  async findOne(id: string): Promise<TransactionEntity | null> {
    return this.transactionProvider.findOne(id);
  }

  async update(
    id: string,
    data: Partial<TransactionEntity>,
    currentTransaction: TransactionEntity,
    currentPayment: AccountEntity | CreditEntity | null,
    payment: AccountEntity | CreditEntity | null,
  ): Promise<TransactionEntity | null> {
    if (
      !!data.paymentId &&
      data.paymentType &&
      currentPayment &&
      payment &&
      (data.paymentType !== currentTransaction.paymentType ||
        data.paymentId !== currentTransaction.paymentId)
    ) {
      await Promise.all([
        this.paymentService.handlePaymentUpdateForTransaction(
          currentTransaction.paymentType,
          currentPayment,
          data as TransactionEntity,
        ),
        this.paymentService.handlePaymentUpdateForTransaction(
          data.paymentType,
          payment,
          data as TransactionEntity,
        ),
      ]);
    }
    await this.analyticsService.updateAnalyticsForTransaction(
      'update',
      currentTransaction,
      data as TransactionEntity,
    );
    return this.transactionProvider.update(id, data);
  }

  async remove(id: string): Promise<TransactionEntity | null> {
    const transaction = await this.transactionProvider.findOne(id);
    if (!transaction) {
      return null;
    }
    if (
      transaction.paymentType === TransactionPaymentType.ACCOUNT &&
      !!transaction.paymentId
    ) {
      const operation =
        transaction.type === TransactionType.EXPENSE
          ? 'increment'
          : 'decrement';
      const account = await this.accountService.findOne(transaction.paymentId);
      if (!account) {
        throw new UnprocessableEntityException(
          this.i18n.t('errorMessages.account.notFound'),
        );
      }
      const exchangeRate = await this.currencyService.getExchangeRate(
        transaction.currency,
        account.currency,
      );
      await this.accountService.updateBalance(
        transaction.paymentId,
        operation,
        convertCurrency(transaction.amount, exchangeRate),
      );
    }
    await this.analyticsService.updateAnalyticsForTransaction(
      'delete',
      transaction,
      undefined,
    );
    return this.transactionProvider.delete(id);
  }

  async removeMany(ids: string[]): Promise<TransactionEntity[] | null> {
    const transactions = await this.transactionProvider.findByIds(ids);
    const accountsAffected = transactions
      .filter(
        (transaction) =>
          transaction.paymentType === TransactionPaymentType.ACCOUNT &&
          !!transaction.paymentId,
      )
      .map((transaction) => transaction.paymentId);
    const accounts = await this.accountService.findByIds(accountsAffected);
    const promises: Promise<AccountEntity | null | void>[] = [];
    for (const account of accounts) {
      const accountTransactions = transactions.filter(
        (transaction) =>
          transaction.paymentId === account.id &&
          transaction.paymentType === TransactionPaymentType.ACCOUNT,
      );
      let totalInAccountCurrency = 0;
      for (const transaction of accountTransactions) {
        const exchangeRate = await this.currencyService.getExchangeRate(
          transaction.currency,
          account.currency,
        );
        totalInAccountCurrency += convertCurrency(
          getTransactionActualAmount(transaction),
          exchangeRate,
        );
        promises.push(
          this.analyticsService.updateAnalyticsForTransaction(
            'delete',
            transaction,
            undefined,
          ),
        );
      }
      promises.push(
        this.accountService.updateBalance(
          account.id,
          'increment',
          totalInAccountCurrency,
        ),
      );
    }
    await Promise.all(promises);
    return this.transactionProvider.deleteMany(ids);
  }

  async findByRecurringTransactionIds(
    recurringTransactionIds: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<TransactionEntity[]> {
    return this.transactionProvider.findByRecurringTransactionIds(
      recurringTransactionIds,
      startDate,
      endDate,
    );
  }

  async removeByLedgerId(ledgerId: string): Promise<void> {
    await this.transactionProvider.deleteByLedgerId(ledgerId);
  }
}
