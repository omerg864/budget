import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecurringTransactionEntity } from '../../../../../shared/types/recurringTransaction.type.js';
import {
  RecurringTransaction,
  RecurringTransactionDocument,
} from './recurringTransaction.model.js';

@Injectable()
export class RecurringTransactionProvider {
  constructor(
    @InjectModel(RecurringTransaction.name)
    private recurringTransactionModel: Model<RecurringTransactionDocument>,
  ) {}

  async create(
    data: Omit<RecurringTransactionEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<RecurringTransactionEntity> {
    const createdTransaction = new this.recurringTransactionModel(data);
    return createdTransaction.save();
  }

  async findByLedgerId(
    ledgerId: string,
  ): Promise<RecurringTransactionEntity[]> {
    return this.recurringTransactionModel.find({ ledgerId });
  }

  async findByCreditId(
    creditId: string,
  ): Promise<RecurringTransactionEntity[]> {
    return this.recurringTransactionModel.find({ creditId });
  }

  async findOne(id: string): Promise<RecurringTransactionEntity | null> {
    return this.recurringTransactionModel.findById(id);
  }

  async update(
    id: string,
    data: Partial<RecurringTransactionEntity>,
  ): Promise<RecurringTransactionEntity | null> {
    return this.recurringTransactionModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async delete(id: string): Promise<RecurringTransactionEntity | null> {
    return this.recurringTransactionModel.findByIdAndDelete(id);
  }

  async deleteByLedgerId(ledgerId: string): Promise<void> {
    await this.recurringTransactionModel.deleteMany({ ledgerId });
  }
}
