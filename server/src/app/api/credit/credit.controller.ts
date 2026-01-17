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
} from '@nestjs/common';
import { API_ROUTES } from '../../../../../shared/constants/routes.constants.js';
import { CreditEntity } from '../../../../../shared/types/credit.type.js';
import type { UserEntity } from '../../../../../shared/types/user.type.js';
import { generateLink } from '../../../../../shared/utils/route.utils.js';
import { LedgerAccessService } from '../../modules/ledgerAccess/ledgerAccess.service.js';
import { AccountService } from '../account/account.service.js';
import { User } from '../auth/auth.decorator.js';
import { CreateCreditDto, UpdateCreditDto } from './credit.dto.js';
import { CreditService } from './credit.service.js';

@Controller(generateLink({ route: [API_ROUTES.CREDIT.BASE] }))
export class CreditController {
  constructor(
    private readonly creditService: CreditService,
    private readonly ledgerAccessService: LedgerAccessService,
    private readonly accountService: AccountService,
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
        'You do not have write access to this ledger to create credit',
      );
    }

    const account = await this.accountService.findOne(
      createCreditDto.accountId,
    );
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.ledgerId !== createCreditDto.ledgerId) {
      throw new ForbiddenException('Account does not belong to this ledger');
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
    @Param('ledgerId') ledgerId: string,
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
    @Param('accountId') accountId: string,
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
    @Param('id') creditId: string,
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
        'You do not have read access to this credit',
      );
    }

    return credit;
  }

  @Patch(API_ROUTES.CREDIT.UPDATE)
  async update(
    @User() user: UserEntity,
    @Param('id') creditId: string,
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
        'You do not have write access to this credit',
      );
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
    @Param('id') creditId: string,
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
        'You do not have delete access to this credit',
      );
    }

    return this.creditService.remove(creditId);
  }
}
