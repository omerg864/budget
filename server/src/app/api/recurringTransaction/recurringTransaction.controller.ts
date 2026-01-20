import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { API_ROUTES } from '../../../../../shared/constants/routes.constants.js';
import { RecurringTransactionEntity } from '../../../../../shared/types/recurringTransaction.type.js';
import type { UserEntity } from '../../../../../shared/types/user.type.js';
import { generateLink } from '../../../../../shared/utils/route.utils.js';
import { ParseObjectIdPipe } from '../../../pipes/parse-object-id.pipe.js';
import { AppI18nService } from '../../modules/i18n/app-i18n.service.js';
import { LedgerAccessService } from '../../modules/ledgerAccess/ledgerAccess.service.js';
import { User } from '../auth/auth.decorator.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CreditService } from '../credit/credit.service.js';
import {
  CreateRecurringTransactionDto,
  UpdateRecurringTransactionDto,
} from './recurringTransaction.dto.js';
import { RecurringTransactionService } from './recurringTransaction.service.js';

@Controller(generateLink({ route: [API_ROUTES.RECURRING_TRANSACTION.BASE] }))
@UseGuards(AuthGuard)
export class RecurringTransactionController {
  constructor(
    private readonly recurringTransactionService: RecurringTransactionService,
    private readonly ledgerAccessService: LedgerAccessService,
    private readonly creditService: CreditService,
    private readonly i18n: AppI18nService,
  ) {}

  @Post(API_ROUTES.RECURRING_TRANSACTION.CREATE)
  @UsePipes(ZodValidationPipe)
  async create(
    @User() user: UserEntity,
    @Body() createDto: CreateRecurringTransactionDto,
  ): Promise<RecurringTransactionEntity> {
    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToTransactionAction(
        createDto.ledgerId,
        user.id,
        'write',
      );

    if (!hasAccess) {
      throw new UnauthorizedException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }

    const credit = await this.creditService.findOne(createDto.creditId);
    if (!credit) {
      throw new NotFoundException(this.i18n.t('errorMessages.credit.notFound'));
    }

    if (credit.ledgerId !== createDto.ledgerId) {
      throw new UnauthorizedException(
        this.i18n.t('errorMessages.credit.accessDenied'),
      );
    }

    return this.recurringTransactionService.create({
      ...createDto,
      userId: user.id,
    });
  }

  @Get(API_ROUTES.RECURRING_TRANSACTION.FIND_ALL)
  async findAll(
    @User() user: UserEntity,
    @Param('ledgerId', ParseObjectIdPipe) ledgerId: string,
  ): Promise<RecurringTransactionEntity[]> {
    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToTransactionAction(
        ledgerId,
        user.id,
        'read',
      );

    if (!hasAccess) {
      throw new UnauthorizedException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }
    return this.recurringTransactionService.findByLedgerId(ledgerId);
  }

  @Get(API_ROUTES.RECURRING_TRANSACTION.FIND_ONE)
  async findOne(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<RecurringTransactionEntity> {
    const transaction = await this.recurringTransactionService.findOne(id);
    if (!transaction) {
      throw new NotFoundException(
        this.i18n.t('errorMessages.recurringTransaction.notFound'),
      );
    }

    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToTransactionAction(
        transaction.ledgerId,
        user.id,
        'read',
      );

    if (!hasAccess) {
      throw new UnauthorizedException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }

    return transaction;
  }

  @Patch(API_ROUTES.RECURRING_TRANSACTION.UPDATE)
  @UsePipes(ZodValidationPipe)
  async update(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateDto: UpdateRecurringTransactionDto,
  ): Promise<RecurringTransactionEntity> {
    const transaction = await this.recurringTransactionService.findOne(id);
    if (!transaction) {
      throw new NotFoundException(
        this.i18n.t('errorMessages.recurringTransaction.notFound'),
      );
    }

    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToTransactionAction(
        transaction.ledgerId,
        user.id,
        'write',
      );

    if (!hasAccess) {
      throw new UnauthorizedException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }

    if (updateDto.creditId && updateDto.ledgerId) {
      const credit = await this.creditService.findOne(updateDto.creditId);
      if (!credit) {
        throw new NotFoundException(
          this.i18n.t('errorMessages.credit.notFound'),
        );
      }

      if (credit.ledgerId !== updateDto.ledgerId) {
        throw new UnauthorizedException(
          this.i18n.t('errorMessages.credit.accessDenied'),
        );
      }
      if (transaction.ledgerId !== updateDto.ledgerId) {
        const hasAccessToNewLedger =
          await this.ledgerAccessService.doesUserHaveAccessToTransactionAction(
            updateDto.ledgerId,
            user.id,
            'write',
          );
        if (!hasAccessToNewLedger) {
          throw new UnauthorizedException(
            this.i18n.t('errorMessages.ledger.accessDenied'),
          );
        }
      }
    }

    const updatedTransaction = await this.recurringTransactionService.update(
      id,
      updateDto,
    );

    if (!updatedTransaction) {
      throw new UnprocessableEntityException(
        'Unable to update recurring transaction',
      );
    }

    return updatedTransaction;
  }

  @Delete(API_ROUTES.RECURRING_TRANSACTION.DELETE)
  async remove(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) id: string,
    @Query('deleteTransactions') deleteTransactions: boolean = false,
  ): Promise<RecurringTransactionEntity> {
    const transaction = await this.recurringTransactionService.findOne(id);
    if (!transaction) {
      throw new NotFoundException(
        this.i18n.t('errorMessages.recurringTransaction.notFound'),
      );
    }

    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToTransactionAction(
        transaction.ledgerId,
        user.id,
        'delete',
      );

    if (!hasAccess) {
      throw new UnauthorizedException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }

    const deletedTransaction = await this.recurringTransactionService.remove(
      id,
      deleteTransactions,
    );
    if (!deletedTransaction) {
      throw new UnprocessableEntityException(
        'Unable to delete recurring transaction',
      );
    }
    return deletedTransaction;
  }
}
