import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ledger, LedgerDocument } from './ledger.model.js';
import { LedgerEntity } from '../../../../../shared/types/ledger.type.js';

@Injectable()
export class LedgerProvider {
  constructor(
    @InjectModel(Ledger.name) private ledgerModel: Model<LedgerDocument>,
  ) {}

  async create(data: Omit<LedgerEntity, 'id'>): Promise<Ledger> {
    const createdLedger = new this.ledgerModel(data);
    return createdLedger.save();
  }

  async findAll(): Promise<Ledger[]> {
    return this.ledgerModel.find().exec();
  }

  async findOne(id: string): Promise<Ledger | null> {
    return this.ledgerModel.findById(id).exec();
  }

  async update(
    id: string,
    data: Partial<LedgerEntity>,
  ): Promise<Ledger | null> {
    return this.ledgerModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<Ledger | null> {
    return this.ledgerModel.findByIdAndDelete(id).exec();
  }
}
