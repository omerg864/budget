import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { SupportedCurrencies } from '@shared/constants/currency.constants';
import { convertCurrency } from '@shared/services/transaction.shared-service';
import { AccountEntity } from '../../../../../shared/types/account.type';
import { AccountProvider } from './account.provider';

@Injectable()
export class AccountService {
  constructor(private readonly accountProvider: AccountProvider) {}

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

  async transfer(
    fromAccount: AccountEntity,
    toAccount: AccountEntity,
    amount: number,
    currency: SupportedCurrencies,
  ): Promise<AccountEntity> {
    const amountInFromAccountCurrency = convertCurrency(amount);
    const amountInToAccountCurrency = convertCurrency(amount);
    const updatedFromAccount = await this.accountProvider.update(
      fromAccount.id,
      {
        balance: fromAccount.balance - amountInFromAccountCurrency,
      },
    );
    const updatedToAccount = await this.accountProvider.update(toAccount.id, {
      balance: toAccount.balance + amountInToAccountCurrency,
    });
    if (!updatedFromAccount || !updatedToAccount) {
      throw new UnprocessableEntityException('Failed to update accounts');
    }
    return updatedToAccount;
  }
}
