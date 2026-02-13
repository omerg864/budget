import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { SupportedCurrencies } from '@shared/constants/currency.constants';
import { convertCurrency } from '@shared/services/transaction.shared-service';
import { parallel } from 'async';
import { CurrencyService } from '../../modules/currency/currency.service';
import { AccountEntity } from '@shared/types/account.type';
import { AccountProvider } from './account.provider';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountProvider: AccountProvider,
    private readonly currencyService: CurrencyService,
  ) {}

  async create(
    data: Omit<AccountEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AccountEntity> {
    return this.accountProvider.create(data);
  }

  async findByIds(ids: string[]): Promise<AccountEntity[]> {
    return this.accountProvider.findByIds(ids);
  }

  async findByLedgerId(ledgerId: string): Promise<AccountEntity[]> {
    return this.accountProvider.findByLedgerId(ledgerId);
  }

  async findOne(id: string): Promise<AccountEntity | null> {
    return this.accountProvider.findOne(id);
  }

  async update(
    id: string,
    data: Partial<AccountEntity>,
  ): Promise<AccountEntity | null> {
    return this.accountProvider.update(id, data);
  }

  async remove(id: string): Promise<AccountEntity | null> {
    return this.accountProvider.delete(id);
  }

  async removeByLedgerId(ledgerId: string): Promise<void> {
    await this.accountProvider.deleteByLedgerId(ledgerId);
  }

  async updateBalance(
    id: string,
    operation: 'increment' | 'decrement',
    amount: number,
  ): Promise<AccountEntity | null> {
    return this.accountProvider.updateBalance(id, operation, amount);
  }

  async transfer(
    fromAccount: AccountEntity,
    toAccount: AccountEntity,
    amount: number,
    currency: SupportedCurrencies,
  ): Promise<AccountEntity> {
    const { fromAccountExchangeRate, toAccountExchangeRate } = await parallel<
      void,
      {
        fromAccountExchangeRate: number;
        toAccountExchangeRate: number;
      }
    >({
      fromAccountExchangeRate: async () =>
        this.currencyService.getExchangeRate(currency, fromAccount.currency),
      toAccountExchangeRate: async () =>
        this.currencyService.getExchangeRate(currency, toAccount.currency),
    });
    const amountInFromAccountCurrency = convertCurrency(
      amount,
      fromAccountExchangeRate,
    );
    const amountInToAccountCurrency = convertCurrency(
      amount,
      toAccountExchangeRate,
    );
    const { updatedFromAccount, updatedToAccount } = await parallel<
      void,
      {
        updatedFromAccount: AccountEntity | null;
        updatedToAccount: AccountEntity | null;
      }
    >({
      updatedFromAccount: async () =>
        this.accountProvider.updateBalance(
          fromAccount.id,
          'decrement',
          amountInFromAccountCurrency,
        ),
      updatedToAccount: async () =>
        this.accountProvider.updateBalance(
          toAccount.id,
          'increment',
          amountInToAccountCurrency,
        ),
    });
    if (!updatedFromAccount || !updatedToAccount) {
      throw new UnprocessableEntityException('Failed to update accounts');
    }
    return updatedToAccount;
  }
}
