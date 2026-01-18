import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LedgerEntity } from '../../../../../shared/types/ledger.type.js';
import { Ledger, LedgerDocument } from './ledger.model.js';

@Injectable()
export class LedgerProvider {
  constructor(
    @InjectModel(Ledger.name) private ledgerModel: Model<LedgerDocument>,
  ) {}

  async create(data: Omit<LedgerEntity, 'id'>): Promise<LedgerEntity> {
    const createdLedger = new this.ledgerModel(data);
    return createdLedger.save();
  }

  async findByIds(ids: string[]): Promise<LedgerEntity[]> {
    if (ids.length === 0) {
      return [];
    }
    return this.ledgerModel.find({ _id: { $in: ids } });
  }

  async findOne(id: string): Promise<LedgerEntity | null> {
    return this.ledgerModel.findById(id);
  }

  async update(
    id: string,
    data: Partial<LedgerEntity>,
  ): Promise<LedgerEntity | null> {
    return this.ledgerModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<LedgerEntity | null> {
    return this.ledgerModel.findByIdAndDelete(id);
  }
}
