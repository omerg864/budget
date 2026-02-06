import { Injectable } from '@nestjs/common';
import {
  TransactionPaymentType,
  TransactionType,
} from '@shared/constants/transaction.constants';
import { convertCurrency } from '@shared/services/transaction.shared-service';
import { LedgerEntity } from '@shared/types/ledger.type';
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
    return this.transactionProvider.delete(id);
  }

  async removeMany(ids: string[]): Promise<TransactionEntity[] | null> {
    return this.transactionProvider.deleteMany(ids);
  }

  async removeByLedgerId(ledgerId: string): Promise<void> {
    await this.transactionProvider.deleteByLedgerId(ledgerId);
  }
}
