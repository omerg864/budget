import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreditEntity } from '../../../../../shared/types/credit.type.js';
import { LedgerAccessService } from '../../modules/ledgerAccess/ledgerAccess.service.js';
import { UserService } from '../user/user.service.js';
import { CreditProvider } from './credit.provider.js';

@Injectable()
export class CreditService {
  constructor(
    private readonly creditProvider: CreditProvider,
    private readonly ledgerAccessService: LedgerAccessService,
    private readonly userService: UserService,
  ) {}

  async create(
    data: Omit<CreditEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CreditEntity> {
    return this.creditProvider.create(data);
  }

  async findAll(): Promise<CreditEntity[]> {
    return this.creditProvider.findAll();
  }

  async findByLedgerId(ledgerId: string): Promise<CreditEntity[]> {
    return this.creditProvider.findByLedgerId(ledgerId);
  }

  async findByAccountId(accountId: string): Promise<CreditEntity[]> {
    return this.creditProvider.findByAccountId(accountId);
  }

  async findOne(id: string): Promise<CreditEntity | null> {
    return this.creditProvider.findOne(id);
  }

  async update(
    id: string,
    data: Partial<CreditEntity>,
  ): Promise<CreditEntity | null> {
    return this.creditProvider.update(id, data);
  }

  async remove(id: string): Promise<CreditEntity | null> {
    return this.creditProvider.delete(id);
  }

  async validateUserForOwner(
    userId: string | undefined,
    ledgerId: string,
  ): Promise<void> {
    if (!userId) {
      return;
    }
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userHasAccessToLedger =
      await this.ledgerAccessService.doesUserHaveAccessToCreditAction(
        userId,
        ledgerId,
        'read',
      );
    if (!userHasAccessToLedger) {
      throw new UnprocessableEntityException(
        'User does not have access to this ledger',
      );
    }
  }
}
