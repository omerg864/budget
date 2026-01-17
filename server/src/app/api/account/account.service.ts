import { Injectable } from '@nestjs/common';
import { AccountEntity } from '../../../../../shared/types/account.type.js';
import { AccountProvider } from './account.provider.js';

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
}
