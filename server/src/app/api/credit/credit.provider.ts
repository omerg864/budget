import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreditEntity } from '../../../../../shared/types/credit.type.js';
import { Credit, CreditDocument } from './credit.model.js';

@Injectable()
export class CreditProvider {
  constructor(
    @InjectModel(Credit.name) private creditModel: Model<CreditDocument>,
  ) {}

  async create(
    data: Omit<CreditEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CreditEntity> {
    const createdCredit = new this.creditModel(data);
    return createdCredit.save();
  }

  async findAll(): Promise<CreditEntity[]> {
    return this.creditModel.find({ deletedAt: null });
  }

  async findByLedgerId(ledgerId: string): Promise<CreditEntity[]> {
    return this.creditModel.find({ ledgerId, deletedAt: null });
  }

  async findByAccountId(accountId: string): Promise<CreditEntity[]> {
    return this.creditModel.find({ accountId, deletedAt: null });
  }

  async findOne(id: string): Promise<CreditEntity | null> {
    return this.creditModel.findOne({ _id: id, deletedAt: null });
  }

  async update(
    id: string,
    data: Partial<CreditEntity>,
  ): Promise<CreditEntity | null> {
    return this.creditModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      data,
      { new: true },
    );
  }

  async delete(id: string): Promise<CreditEntity | null> {
    return this.creditModel.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true },
    );
  }

  async deleteByLedgerId(ledgerId: string): Promise<void> {
    await this.creditModel.deleteMany({ ledgerId });
  }
}
