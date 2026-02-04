import { Injectable } from '@nestjs/common';
import { LedgerAccessRole } from '@shared/constants/ledger.constants';
import { LedgerAccessEntity } from '../../../types/ledgerAccess.type';
import { LedgerAccess } from './ledgerAccess.model';
import { LedgerAccessProvider } from './ledgerAccess.provider';

@Injectable()
export class LedgerAccessService {
  constructor(private readonly ledgerAccessProvider: LedgerAccessProvider) {}

  async create(data: LedgerAccessEntity): Promise<LedgerAccess> {
    return this.ledgerAccessProvider.create(data);
  }

  async findByUserId(userId: string): Promise<LedgerAccess[]> {
    return this.ledgerAccessProvider.findByUserId(userId);
  }

  async getByLedgerId(ledgerId: string): Promise<LedgerAccess[]> {
    return this.ledgerAccessProvider.findByLedgerId(ledgerId);
  }

  async findByLedgerIdAndUserId(
    ledgerId: string,
    userId: string,
  ): Promise<LedgerAccess | null> {
    return this.ledgerAccessProvider.findByLedgerIdAndUserId(ledgerId, userId);
  }

  async update(
    id: string,
    data: Partial<LedgerAccessEntity>,
  ): Promise<LedgerAccess | null> {
    return this.ledgerAccessProvider.update(id, data);
  }

  async remove(id: string): Promise<LedgerAccess | null> {
    return this.ledgerAccessProvider.delete(id);
  }

  async removeByLedgerIdAndUserId(
    ledgerId: string,
    userId: string,
  ): Promise<LedgerAccess | null> {
    return this.ledgerAccessProvider.deleteByLedgerIdAndUserId(
      ledgerId,
      userId,
    );
  }

  async doesUserHaveAccessToUserAction(
    ledgerId: string,
    userId: string,
    action: 'read' | 'write' | 'delete',
  ): Promise<boolean> {
    const ledgerAccess = await this.findByLedgerIdAndUserId(ledgerId, userId);
    if (!ledgerAccess) {
      return false;
    }
    switch (action) {
      case 'read':
        return true;
      case 'write':
        return ledgerAccess.role !== LedgerAccessRole.READ_ONLY;
      case 'delete':
        return ledgerAccess.role === LedgerAccessRole.OWNER;
    }
  }

  async doesUserHaveAccessToLedgerAction(
    ledgerId: string,
    userId: string,
    action: 'read' | 'write' | 'delete',
  ): Promise<boolean> {
    const ledgerAccess = await this.findByLedgerIdAndUserId(ledgerId, userId);
    if (!ledgerAccess) {
      return false;
    }
    switch (action) {
      case 'read':
        return true;
      case 'write':
        return ledgerAccess.role !== LedgerAccessRole.READ_ONLY;
      case 'delete':
        return ledgerAccess.role === LedgerAccessRole.OWNER;
    }
  }

  async doesUserHaveAccessToAccountAction(
    ledgerId: string,
    userId: string,
    action: 'read' | 'write' | 'delete',
  ): Promise<boolean> {
    const ledgerAccess = await this.findByLedgerIdAndUserId(ledgerId, userId);
    if (!ledgerAccess) {
      return false;
    }
    switch (action) {
      case 'read':
        return true;
      case 'write':
        return ledgerAccess.role !== LedgerAccessRole.READ_ONLY;
      case 'delete':
        return ledgerAccess.role !== LedgerAccessRole.READ_ONLY;
    }
  }

  async doesUserHaveAccessToCreditAction(
    ledgerId: string,
    userId: string,
    action: 'read' | 'write' | 'delete',
  ): Promise<boolean> {
    const ledgerAccess = await this.findByLedgerIdAndUserId(ledgerId, userId);
    if (!ledgerAccess) {
      return false;
    }
    switch (action) {
      case 'read':
        return true;
      case 'write':
        return ledgerAccess.role !== LedgerAccessRole.READ_ONLY;
      case 'delete':
        return ledgerAccess.role !== LedgerAccessRole.READ_ONLY;
    }
  }

  async doesUserHaveAccessToTransactionAction(
    ledgerId: string,
    userId: string,
    action: 'read' | 'write' | 'delete',
  ): Promise<boolean> {
    const ledgerAccess = await this.findByLedgerIdAndUserId(ledgerId, userId);
    if (!ledgerAccess) {
      return false;
    }
    switch (action) {
      case 'read':
        return true;
      case 'write':
        return ledgerAccess.role !== LedgerAccessRole.READ_ONLY;
      case 'delete':
        return ledgerAccess.role !== LedgerAccessRole.READ_ONLY;
    }
  }
}
