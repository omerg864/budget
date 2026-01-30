import { Injectable } from '@nestjs/common';
import { TransactionEntity } from '../../../../../shared/types/transaction.type';
import { LedgerAccessService } from '../../modules/ledgerAccess/ledgerAccess.service';
import { UserService } from '../user/user.service';
import { TransactionProvider } from './transaction.provider';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionProvider: TransactionProvider,
    private readonly ledgerAccessService: LedgerAccessService,
    private readonly userService: UserService,
  ) {}

  async create(
    data: Omit<TransactionEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<TransactionEntity> {
    return this.transactionProvider.create(data);
  }

  async createMany(
    data: Omit<TransactionEntity, 'id' | 'createdAt' | 'updatedAt'>[],
  ): Promise<TransactionEntity[]> {
    return this.transactionProvider.createMany(data);
  }

  async findByLedgerId(
    ledgerId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<TransactionEntity[]> {
    return this.transactionProvider.findByLedgerId(
      ledgerId,
      startDate,
      endDate,
    );
  }

  async findByCreditId(
    creditId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<TransactionEntity[]> {
    return this.transactionProvider.findByCreditId(
      creditId,
      startDate,
      endDate,
    );
  }

  async findOne(id: string): Promise<TransactionEntity | null> {
    return this.transactionProvider.findOne(id);
  }

  async update(
    id: string,
    data: Partial<TransactionEntity>,
  ): Promise<TransactionEntity | null> {
    return this.transactionProvider.update(id, data);
  }

  async remove(id: string): Promise<TransactionEntity | null> {
    return this.transactionProvider.delete(id);
  }

  async removeMany(ids: string[]): Promise<TransactionEntity[] | null> {
    return this.transactionProvider.deleteMany(ids);
  }

  async removeByLedgerId(ledgerId: string): Promise<void> {
    await this.transactionProvider.deleteByLedgerId(ledgerId);
  }
}
