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
import { LedgerEntity } from '@shared/types/ledger.type';
import { AppI18nService } from 'src/app/modules/i18n/app-i18n.service';
import { TransactionEntity } from '../../../../../shared/types/transaction.type';
import { CurrencyService } from '../../modules/currency/currency.service';
import { LedgerAccessService } from '../../modules/ledgerAccess/ledgerAccess.service';
import { AccountService } from '../account/account.service';
import { UserService } from '../user/user.service';
import { TransactionProvider } from './transaction.provider';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionProvider: TransactionProvider,
    private readonly ledgerAccessService: LedgerAccessService,
    private readonly accountService: AccountService,
    private readonly currencyService: CurrencyService,
    private readonly userService: UserService,
    private readonly i18n: AppI18nService,
  ) {}

  async create(
    data: Omit<TransactionEntity, 'id' | 'createdAt' | 'updatedAt'>,
    ledger: LedgerEntity,
  ): Promise<TransactionEntity> {
    if (
      data.paymentType === TransactionPaymentType.ACCOUNT &&
      !!data.paymentId
    ) {
      const operation =
        data.type === TransactionType.EXPENSE ? 'decrement' : 'increment';
      const exchangeRate = await this.currencyService.getExchangeRate(
        data.currency,
        ledger.currency,
      );
      await this.accountService.updateBalance(
        data.paymentId,
        operation,
        convertCurrency(data.amount, exchangeRate),
      );
    }
    return this.transactionProvider.create(data);
  }

  async createMany(
    data: Omit<TransactionEntity, 'id' | 'createdAt' | 'updatedAt'>[],
  ): Promise<TransactionEntity[]> {
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
    ledger: LedgerEntity,
  ): Promise<TransactionEntity | null> {
    if (
      !!data.paymentId &&
      (data.paymentType !== currentTransaction.paymentType ||
        data.paymentId !== currentTransaction.paymentId)
    ) {
      if (
        data.paymentType === TransactionPaymentType.ACCOUNT &&
        !!data.paymentId
      ) {
        const operation =
          data.type === TransactionType.EXPENSE ? 'decrement' : 'increment';
        const exchangeRate = await this.currencyService.getExchangeRate(
          data.currency ?? ledger.currency,
          ledger.currency,
        );
        await this.accountService.updateBalance(
          data.paymentId,
          operation,
          convertCurrency(
            data.amount ?? currentTransaction.amount,
            exchangeRate,
          ),
        );
      }
      if (
        currentTransaction.paymentType === TransactionPaymentType.ACCOUNT &&
        !!currentTransaction.paymentId
      ) {
        const operation =
          currentTransaction.type === TransactionType.EXPENSE
            ? 'increment'
            : 'decrement';
        const exchangeRate = await this.currencyService.getExchangeRate(
          currentTransaction.currency,
          ledger.currency,
        );
        await this.accountService.updateBalance(
          currentTransaction.paymentId,
          operation,
          convertCurrency(currentTransaction.amount, exchangeRate),
        );
      }
    }
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
    const promises: Promise<AccountEntity | null>[] = [];
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

  async removeByLedgerId(ledgerId: string): Promise<void> {
    await this.transactionProvider.deleteByLedgerId(ledgerId);
  }
}
