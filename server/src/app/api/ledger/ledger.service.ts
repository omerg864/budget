import { Injectable } from '@nestjs/common';
import { LedgerEntity } from '../../../../../shared/types/ledger.type.js';
import { LedgerProvider } from './ledger.provider.js';

@Injectable()
export class LedgerService {
  constructor(private readonly ledgerProvider: LedgerProvider) {}

  async create(data: Omit<LedgerEntity, 'id'>): Promise<LedgerEntity> {
    return this.ledgerProvider.create(data);
  }

  async findByIds(ids: string[]): Promise<LedgerEntity[]> {
    return this.ledgerProvider.findByIds(ids);
  }

  async findOne(id: string): Promise<LedgerEntity | null> {
    return this.ledgerProvider.findOne(id);
  }

  async update(
    id: string,
    data: Partial<LedgerEntity>,
  ): Promise<LedgerEntity | null> {
    return this.ledgerProvider.update(id, data);
  }

  async remove(id: string): Promise<LedgerEntity | null> {
    return this.ledgerProvider.delete(id);
  }
}
