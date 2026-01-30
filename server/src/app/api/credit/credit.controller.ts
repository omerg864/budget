import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { API_ROUTES } from '../../../../../shared/constants/routes.constants';
import { CreditEntity } from '../../../../../shared/types/credit.type';
import type { UserEntity } from '../../../../../shared/types/user.type';
import { generateLink } from '../../../../../shared/utils/route.utils';
import { ParseObjectIdPipe } from '../../../pipes/parse-object-id.pipe';
import { AppI18nService } from '../../modules/i18n/app-i18n.service';
import { LedgerAccessService } from '../../modules/ledgerAccess/ledgerAccess.service';
import { AccountService } from '../account/account.service';
import { User } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCreditDto, UpdateCreditDto } from './credit.dto';
import { CreditService } from './credit.service';

@Controller(generateLink({ route: [API_ROUTES.CREDIT.BASE] }))
@UseGuards(AuthGuard)
export class CreditController {
  constructor(
    private readonly creditService: CreditService,
    private readonly ledgerAccessService: LedgerAccessService,
    private readonly accountService: AccountService,
    private readonly i18n: AppI18nService,
  ) {}

  @Post(API_ROUTES.CREDIT.CREATE)
  async create(
    @User() user: UserEntity,
    @Body() createCreditDto: CreateCreditDto,
  ): Promise<CreditEntity> {
    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToCreditAction(
        createCreditDto.ledgerId,
        user.id,
        'write',
      );

    if (!hasAccess) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }

    const account = await this.accountService.findOne(
      createCreditDto.accountId,
    );
    if (!account) {
      throw new NotFoundException(
        this.i18n.t('errorMessages.account.notFound'),
      );
    }

    if (account.ledgerId !== createCreditDto.ledgerId) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.credit.accountNotBelongToLedger'),
      );
    }

    await this.creditService.validateUserForOwner(
      createCreditDto.ownerId,
      createCreditDto.ledgerId,
    );

    return this.creditService.create({ ...createCreditDto, amount: 0 });
  }

  @Get(API_ROUTES.CREDIT.FIND_ALL)
  async findAll(
    @User() user: UserEntity,
    @Param('ledgerId', ParseObjectIdPipe) ledgerId: string,
  ): Promise<CreditEntity[]> {
    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToCreditAction(
        ledgerId,
        user.id,
        'read',
      );

    if (!hasAccess) {
      throw new ForbiddenException(
        'You do not have read access to this ledger to find credits',
      );
    }

    return this.creditService.findByLedgerId(ledgerId);
  }

  @Get(API_ROUTES.CREDIT.FIND_BY_ACCOUNT)
  async findByAccount(
    @User() user: UserEntity,
    @Param('accountId', ParseObjectIdPipe) accountId: string,
  ): Promise<CreditEntity[]> {
    const account = await this.accountService.findOne(accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToCreditAction(
        account.ledgerId,
        user.id,
        'read',
      );

    if (!hasAccess) {
      throw new ForbiddenException(
        'You do not have read access to this ledger to find credits',
      );
    }

    return this.creditService.findByAccountId(accountId);
  }

  @Get(API_ROUTES.CREDIT.FIND_ONE)
  async findOne(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) creditId: string,
  ): Promise<CreditEntity | null> {
    const credit = await this.creditService.findOne(creditId);
    if (!credit) {
      throw new NotFoundException('Credit not found');
    }

    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToCreditAction(
        credit.ledgerId,
        user.id,
        'read',
      );

    if (!hasAccess) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.credit.accessDenied'),
      );
    }

    return credit;
  }

  @Patch(API_ROUTES.CREDIT.UPDATE)
  async update(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) creditId: string,
    @Body() updateData: UpdateCreditDto,
  ): Promise<CreditEntity | null> {
    const credit = await this.creditService.findOne(creditId);
    if (!credit) {
      throw new NotFoundException('Credit not found');
    }

    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToCreditAction(
        credit.ledgerId,
        user.id,
        'write',
      );

    if (!hasAccess) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.credit.accessDenied'),
      );
    }

    if (updateData.accountId) {
      const account = await this.accountService.findOne(updateData.accountId);
      if (!account) {
        throw new NotFoundException(
          this.i18n.t('errorMessages.account.notFound'),
        );
      }

      if (account.ledgerId !== updateData.ledgerId) {
        throw new ForbiddenException(
          this.i18n.t('errorMessages.credit.accountNotBelongToLedger'),
        );
      }
      if (credit.ledgerId !== account.ledgerId) {
        const hasAccessToNewLedger =
          await this.ledgerAccessService.doesUserHaveAccessToCreditAction(
            account.ledgerId,
            user.id,
            'write',
          );

        if (!hasAccessToNewLedger) {
          throw new ForbiddenException(
            this.i18n.t('errorMessages.ledger.accessDenied'),
          );
        }
      }
    }

    await this.creditService.validateUserForOwner(
      updateData.ownerId,
      credit.ledgerId,
    );

    return this.creditService.update(creditId, updateData);
  }

  @Delete(API_ROUTES.CREDIT.DELETE)
  async remove(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) creditId: string,
  ): Promise<CreditEntity | null> {
    const credit = await this.creditService.findOne(creditId);
    if (!credit) {
      throw new NotFoundException('Credit not found');
    }

    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToCreditAction(
        credit.ledgerId,
        user.id,
        'delete',
      );

    if (!hasAccess) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.credit.accessDenied'),
      );
    }

    return this.creditService.remove(creditId);
  }
}
