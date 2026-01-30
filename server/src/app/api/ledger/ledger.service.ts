import { Injectable } from '@nestjs/common';
import { LedgerEntity } from '../../../../../shared/types/ledger.type';
import { AccountService } from '../account/account.service';
import { CreditService } from '../credit/credit.service';
import { RecurringTransactionService } from '../recurringTransaction/recurringTransaction.service';
import { TransactionService } from '../transaction/transaction.service';
import { LedgerProvider } from './ledger.provider';

@Injectable()
export class LedgerService {
  constructor(
    private readonly ledgerProvider: LedgerProvider,
    private readonly transactionService: TransactionService,
    private readonly recurringTransactionService: RecurringTransactionService,
    private readonly creditService: CreditService,
    private readonly accountService: AccountService,
  ) {}

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
    const deleted = await this.ledgerProvider.delete(id);
    await Promise.allSettled([
      this.transactionService.removeByLedgerId(id),
      this.recurringTransactionService.removeByLedgerId(id),
      this.creditService.removeByLedgerId(id),
      this.accountService.removeByLedgerId(id),
    ]);
    return deleted;
  }
}
