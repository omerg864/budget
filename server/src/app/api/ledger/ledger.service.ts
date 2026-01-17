import { Injectable } from '@nestjs/common';
import { LedgerProvider } from './ledger.provider.js';
import { Ledger } from './ledger.model.js';
import { LedgerEntity } from '../../../../../shared/types/ledger.type.js';

@Injectable()
export class LedgerService {
  constructor(private readonly ledgerProvider: LedgerProvider) {}

  async create(data: Omit<LedgerEntity, 'id'>): Promise<Ledger> {
    return this.ledgerProvider.create(data);
  }

  async findAll(): Promise<Ledger[]> {
    return this.ledgerProvider.findAll();
  }

  async findOne(id: string): Promise<Ledger | null> {
    return this.ledgerProvider.findOne(id);
  }

  async update(
    id: string,
    data: Partial<LedgerEntity>,
  ): Promise<Ledger | null> {
    return this.ledgerProvider.update(id, data);
  }

  async remove(id: string): Promise<Ledger | null> {
    return this.ledgerProvider.delete(id);
  }
}
