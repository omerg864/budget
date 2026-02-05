import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  LedgerCategory,
  LedgerEntity,
} from '../../../../../shared/types/ledger.type';
import { LedgerAccess } from '../../modules/ledgerAccess/ledgerAccess.model';
import { AccountService } from '../account/account.service';
import { CreditService } from '../credit/credit.service';
import { RecurringTransactionService } from '../recurringTransaction/recurringTransaction.service';
import { TransactionService } from '../transaction/transaction.service';
import { LedgerDocument } from './ledger.model.js';
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

  async addCategory(
    ledgerId: LedgerEntity['id'],
    category: Omit<LedgerCategory, 'id'>,
  ): Promise<LedgerEntity | null> {
    const ledger = await this.findOne(ledgerId);
    if (!ledger) return null;
    const newCategory = {
      ...category,
      _id: new Types.ObjectId(),
    };
    return this.ledgerProvider.addCategory(ledgerId, newCategory);
  }

  async updateCategory(
    ledgerId: string,
    categoryId: string,
    categoryData: Partial<LedgerCategory>,
  ): Promise<LedgerEntity | null> {
    const ledger = await this.findOne(ledgerId);
    if (!ledger) return null;

    const ledgerObj = (ledger as LedgerDocument).toObject();
    const categoryIndex = ledgerObj.categories.findIndex(
      (c) => c.id.toString() === categoryId,
    );

    if (categoryIndex === -1) return null;

    const updatedCategories = [...ledgerObj.categories];
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      ...categoryData,
    };

    return this.update(ledgerId, {
      categories: updatedCategories,
    });
  }

  async removeCategory(
    ledgerId: string,
    categoryId: string,
  ): Promise<LedgerEntity | null> {
    const ledger = await this.findOne(ledgerId);
    if (!ledger) return null;

    const ledgerObj = (ledger as LedgerDocument).toObject();
    const updatedCategories = ledgerObj.categories.filter(
      (c) => c.id.toString() !== categoryId,
    );

    if (updatedCategories.length === ledgerObj.categories.length) return null;

    return this.update(ledgerId, {
      categories: updatedCategories,
    });
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

  public resolveLedger(
    ledger: LedgerEntity,
    ledgerAccess: LedgerAccess,
  ): LedgerEntity {
    return {
      ...(((ledger as LedgerDocument).toJSON
        ? (ledger as LedgerDocument).toJSON()
        : ledger) as LedgerEntity),
      access: ledgerAccess.role,
    };
  }
}
