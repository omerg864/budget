import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreditEntity } from '../../../../../shared/types/credit.type.js';
import { AppI18nService } from '../../modules/i18n/app-i18n.service.js';
import { LedgerAccessService } from '../../modules/ledgerAccess/ledgerAccess.service.js';
import { UserService } from '../user/user.service.js';
import { CreditProvider } from './credit.provider.js';

@Injectable()
export class CreditService {
  constructor(
    private readonly creditProvider: CreditProvider,
    private readonly ledgerAccessService: LedgerAccessService,
    private readonly userService: UserService,
    private readonly i18n: AppI18nService,
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

  async removeByLedgerId(ledgerId: string): Promise<void> {
    await this.creditProvider.deleteByLedgerId(ledgerId);
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
      throw new NotFoundException(this.i18n.t('errorMessages.user.notFound'));
    }
    const userHasAccessToLedger =
      await this.ledgerAccessService.doesUserHaveAccessToCreditAction(
        ledgerId,
        userId,
        'read',
      );
    if (!userHasAccessToLedger) {
      throw new UnprocessableEntityException(
        this.i18n.t('errorMessages.credit.accessDenied'),
      );
    }
  }
}
