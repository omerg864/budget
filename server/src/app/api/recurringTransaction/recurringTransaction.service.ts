import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import { getThisMonthChargeDates } from '../../../../../shared/services/transaction.shared-service.js';
import { RecurringTransactionEntity } from '../../../../../shared/types/recurringTransaction.type.js';
import { TransactionEntity } from '../../../../../shared/types/transaction.type.js';
import { TransactionService } from '../transaction/transaction.service.js';
import { RecurringTransactionProvider } from './recurringTransaction.provider.js';

@Injectable()
export class RecurringTransactionService {
  constructor(
    private readonly recurringTransactionProvider: RecurringTransactionProvider,
    private readonly transactionService: TransactionService,
  ) {}

  private createTransactionEntity(
    date: Date,
    recurringTransaction: RecurringTransactionEntity,
  ): Omit<TransactionEntity, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      date,
      description: recurringTransaction.description,
      amount: recurringTransaction.amount,
      creditId: recurringTransaction.creditId,
      ledgerId: recurringTransaction.ledgerId,
      type: recurringTransaction.type,
      category: recurringTransaction.category,
      notes: recurringTransaction.notes,
      receiptImageId: recurringTransaction.receiptImageId,
      recurringTransactionId: recurringTransaction.id,
      userId: recurringTransaction.userId,
    } satisfies Omit<TransactionEntity, 'id' | 'createdAt' | 'updatedAt'>;
  }

  async create(
    data: Omit<RecurringTransactionEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<RecurringTransactionEntity> {
    const recurringTransaction =
      await this.recurringTransactionProvider.create(data);
    const thisMonthChargeDates = getThisMonthChargeDates(
      recurringTransaction,
      new Date(),
    );
    if (thisMonthChargeDates.length > 0) {
      await this.transactionService.createMany(
        thisMonthChargeDates.map((date) =>
          this.createTransactionEntity(date, recurringTransaction),
        ),
      );
    }
    return recurringTransaction;
  }

  async findByLedgerId(
    ledgerId: string,
  ): Promise<RecurringTransactionEntity[]> {
    return this.recurringTransactionProvider.findByLedgerId(ledgerId);
  }

  async findByCreditId(
    creditId: string,
  ): Promise<RecurringTransactionEntity[]> {
    return this.recurringTransactionProvider.findByCreditId(creditId);
  }

  async findOne(id: string): Promise<RecurringTransactionEntity | null> {
    return this.recurringTransactionProvider.findOne(id);
  }

  async update(
    id: string,
    data: Partial<RecurringTransactionEntity>,
  ): Promise<RecurringTransactionEntity | null> {
    return this.recurringTransactionProvider.update(id, data);
  }

  async remove(
    id: string,
    removeThisMonthTransactions = false,
  ): Promise<RecurringTransactionEntity | null> {
    if (removeThisMonthTransactions) {
      const recurringTransaction = await this.findOne(id);
      if (!recurringTransaction) {
        return null;
      }
      const startMonth = DateTime.now().startOf('month');
      const endMonth = DateTime.now().endOf('month');
      const transactions = await this.transactionService.findByLedgerId(
        recurringTransaction.ledgerId,
        startMonth.toJSDate(),
        endMonth.toJSDate(),
      );
      if (transactions.length > 0) {
        await this.transactionService.removeMany(
          transactions.map((transaction) => transaction.id),
        );
      }
    }
    return this.recurringTransactionProvider.delete(id);
  }

  async removeByLedgerId(ledgerId: string): Promise<void> {
    await this.recurringTransactionProvider.deleteByLedgerId(ledgerId);
  }
}
