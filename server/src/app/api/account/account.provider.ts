import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountEntity } from '../../../../../shared/types/account.type';
import { Account, AccountDocument } from './account.model';

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
    return this.accountModel.find({ _id: { $in: ids }, deletedAt: null });
  }

  async findByLedgerId(ledgerId: string): Promise<AccountEntity[]> {
    return this.accountModel.find({ ledgerId, deletedAt: null });
  }

  async findOne(id: string): Promise<AccountEntity | null> {
    return this.accountModel.findOne({ _id: id, deletedAt: null });
  }

  async update(
    id: string,
    data: Partial<AccountEntity>,
  ): Promise<AccountEntity | null> {
    return this.accountModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      data,
      { new: true },
    );
  }

  async updateBalance(
    id: string,
    operation: 'increment' | 'decrement',
    amount: number,
  ): Promise<AccountEntity | null> {
    if (operation === 'increment') {
      return this.incrementBalance(id, amount);
    }
    return this.decrementBalance(id, amount);
  }

  private async decrementBalance(
    id: string,
    amount: number,
  ): Promise<AccountEntity | null> {
    return this.accountModel.findByIdAndUpdate(
      id,
      { $inc: { balance: -amount } },
      { new: true },
    );
  }

  private async incrementBalance(
    id: string,
    amount: number,
  ): Promise<AccountEntity | null> {
    return this.accountModel.findByIdAndUpdate(
      id,
      { $inc: { balance: amount } },
      { new: true },
    );
  }

  async delete(id: string): Promise<AccountEntity | null> {
    return this.accountModel.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true },
    );
  }

  async deleteByLedgerId(ledgerId: string): Promise<void> {
    await this.accountModel.deleteMany({ ledgerId });
  }
}
