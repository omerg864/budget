import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountEntity } from '../../../../../shared/types/account.type.js';
import { Account, AccountDocument } from './account.model.js';

@Injectable()
export class AccountProvider {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async create(
    data: Omit<AccountEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AccountEntity> {
    const createdAccount = new this.accountModel(data);
    return createdAccount.save();
  }

  async findByIds(ids: string[]): Promise<AccountEntity[]> {
    if (ids.length === 0) {
      return [];
    }
    return this.accountModel.find({ _id: { $in: ids } });
  }

  async findByLedgerId(ledgerId: string): Promise<AccountEntity[]> {
    return this.accountModel.find({ ledgerId });
  }

  async findOne(id: string): Promise<AccountEntity | null> {
    return this.accountModel.findById(id);
  }

  async update(
    id: string,
    data: Partial<AccountEntity>,
  ): Promise<AccountEntity | null> {
    return this.accountModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<AccountEntity | null> {
    return this.accountModel.findByIdAndDelete(id);
  }
}
