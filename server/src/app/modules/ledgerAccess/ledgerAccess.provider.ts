import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LedgerAccessEntity } from '../../../types/ledgerAccess.type.js';
import { LedgerAccess, LedgerAccessDocument } from './ledgerAccess.model.js';

@Injectable()
export class LedgerAccessProvider {
  constructor(
    @InjectModel(LedgerAccess.name)
    private ledgerAccessModel: Model<LedgerAccessDocument>,
  ) {}

  async create(data: LedgerAccessEntity): Promise<LedgerAccess> {
    const createdLedgerAccess = new this.ledgerAccessModel(data);
    return createdLedgerAccess.save();
  }

  async findByUserId(userId: string): Promise<LedgerAccess[]> {
    return this.ledgerAccessModel.find({ userId });
  }

  async findByLedgerId(ledgerId: string): Promise<LedgerAccess[]> {
    return this.ledgerAccessModel.find({ ledgerId });
  }

  async findByLedgerIdAndUserId(
    ledgerId: string,
    userId: string,
  ): Promise<LedgerAccess | null> {
    return this.ledgerAccessModel.findOne({ ledgerId, userId });
  }

  async update(
    id: string,
    data: Partial<LedgerAccessEntity>,
  ): Promise<LedgerAccess | null> {
    return this.ledgerAccessModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<LedgerAccess | null> {
    return this.ledgerAccessModel.findByIdAndDelete(id);
  }
}
