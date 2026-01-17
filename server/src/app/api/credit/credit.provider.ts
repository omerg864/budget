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
    return this.creditModel.find();
  }

  async findByLedgerId(ledgerId: string): Promise<CreditEntity[]> {
    return this.creditModel.find({ ledgerId });
  }

  async findByAccountId(accountId: string): Promise<CreditEntity[]> {
    return this.creditModel.find({ accountId });
  }

  async findOne(id: string): Promise<CreditEntity | null> {
    return this.creditModel.findById(id);
  }

  async update(
    id: string,
    data: Partial<CreditEntity>,
  ): Promise<CreditEntity | null> {
    return this.creditModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<CreditEntity | null> {
    return this.creditModel.findByIdAndDelete(id);
  }
}
