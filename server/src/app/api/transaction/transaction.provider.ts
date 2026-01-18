import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TransactionEntity } from '../../../../../shared/types/transaction.type.js';
import { Transaction, TransactionDocument } from './transaction.model.js';

@Injectable()
export class TransactionProvider {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(
    data: Omit<TransactionEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<TransactionEntity> {
    const createdTransaction = new this.transactionModel(data);
    return createdTransaction.save();
  }

  async createMany(
    data: Omit<TransactionEntity, 'id' | 'createdAt' | 'updatedAt'>[],
  ): Promise<TransactionEntity[]> {
    return this.transactionModel.insertMany(data);
  }

  async findByLedgerId(
    ledgerId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<TransactionEntity[]> {
    const query: any = {
      ledgerId,
    };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }
    return this.transactionModel.find(query);
  }

  async findByCreditId(
    creditId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<TransactionEntity[]> {
    const query: any = { creditId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = startDate;
      if (endDate) query.date.$lte = endDate;
    }
    return this.transactionModel.find(query);
  }

  async findOne(id: string): Promise<TransactionEntity | null> {
    return this.transactionModel.findById(id);
  }

  async update(
    id: string,
    data: Partial<TransactionEntity>,
  ): Promise<TransactionEntity | null> {
    return this.transactionModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<TransactionEntity | null> {
    return this.transactionModel.findByIdAndDelete(id);
  }

  async deleteMany(ids: string[]): Promise<TransactionEntity[] | null> {
    if (ids.length === 0) {
      return [];
    }
    const deleted = await this.transactionModel.find({
      _id: { $in: ids },
    });
    await this.transactionModel.deleteMany({
      _id: { $in: ids },
    });
    return deleted;
  }

  async deleteByLedgerId(ledgerId: string): Promise<void> {
    await this.transactionModel.deleteMany({ ledgerId });
  }
}
