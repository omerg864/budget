import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseDatePipe,
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
import { TransactionEntity } from '../../../../../shared/types/transaction.type.js';
import type { UserEntity } from '../../../../../shared/types/user.type.js';
import { generateLink } from '../../../../../shared/utils/route.utils.js';
import { ParseObjectIdPipe } from '../../../pipes/parse-object-id.pipe.js';
import { AppI18nService } from '../../modules/i18n/app-i18n.service.js';
import { LedgerAccessService } from '../../modules/ledgerAccess/ledgerAccess.service.js';
import { User } from '../auth/auth.decorator.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CreditService } from '../credit/credit.service.js';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './transaction.dto.js';
import { TransactionService } from './transaction.service.js';

@Controller(generateLink({ route: [API_ROUTES.TRANSACTION.BASE] }))
@UseGuards(AuthGuard)
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly ledgerAccessService: LedgerAccessService,
    private readonly creditService: CreditService,
    private readonly i18n: AppI18nService,
  ) {}

  @Post(API_ROUTES.TRANSACTION.CREATE)
  @UsePipes(ZodValidationPipe)
  async create(
    @User() user: UserEntity,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToTransactionAction(
        createTransactionDto.ledgerId,
        user.id,
        'write',
      );

    if (!hasAccess) {
      throw new UnauthorizedException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }

    const credit = await this.creditService.findOne(
      createTransactionDto.creditId,
    );
    if (!credit) {
      throw new NotFoundException(this.i18n.t('errorMessages.credit.notFound'));
    }

    if (credit.ledgerId !== createTransactionDto.ledgerId) {
      throw new UnauthorizedException(
        this.i18n.t('errorMessages.credit.accessDenied'),
      );
    }

    return this.transactionService.create({
      ...createTransactionDto,
      userId: user.id,
    });
  }

  @Get(API_ROUTES.TRANSACTION.FIND_ALL)
  async findAll(
    @User() user: UserEntity,
    @Param('ledgerId', ParseObjectIdPipe) ledgerId: string,
    @Query('startDate', new ParseDatePipe({ optional: true })) startDate: Date,
    @Query('endDate', new ParseDatePipe({ optional: true })) endDate: Date,
  ): Promise<TransactionEntity[]> {
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
    return this.transactionService.findByLedgerId(ledgerId, startDate, endDate);
  }

  @Get(API_ROUTES.TRANSACTION.FIND_BY_CREDIT)
  async findByCredit(
    @User() user: UserEntity,
    @Param('creditId', ParseObjectIdPipe) creditId: string,
    @Query('startDate', new ParseDatePipe({ optional: true })) startDate: Date,
    @Query('endDate', new ParseDatePipe({ optional: true })) endDate: Date,
  ): Promise<TransactionEntity[]> {
    const credit = await this.creditService.findOne(creditId);
    if (!credit) {
      throw new NotFoundException(this.i18n.t('errorMessages.credit.notFound'));
    }

    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToTransactionAction(
        credit.ledgerId,
        user.id,
        'read',
      );

    if (!hasAccess) {
      throw new UnauthorizedException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }

    const transactions = await this.transactionService.findByCreditId(
      credit.id,
      startDate,
      endDate,
    );

    return transactions;
  }

  @Get(API_ROUTES.TRANSACTION.FIND_ONE)
  async findOne(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<TransactionEntity> {
    const transaction = await this.transactionService.findOne(id);
    if (!transaction) {
      throw new NotFoundException(
        this.i18n.t('errorMessages.transaction.notFound'),
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

  @Patch(API_ROUTES.TRANSACTION.UPDATE)
  @UsePipes(ZodValidationPipe)
  async update(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ): Promise<TransactionEntity> {
    const transaction = await this.transactionService.findOne(id);
    if (!transaction) {
      throw new NotFoundException(
        this.i18n.t('errorMessages.transaction.notFound'),
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

    if (updateTransactionDto.creditId) {
      const credit = await this.creditService.findOne(
        updateTransactionDto.creditId,
      );
      if (!credit) {
        throw new NotFoundException(
          this.i18n.t('errorMessages.credit.notFound'),
        );
      }

      if (credit.ledgerId !== updateTransactionDto.ledgerId) {
        throw new UnauthorizedException(
          this.i18n.t('errorMessages.credit.accessDenied'),
        );
      }
      if (transaction.ledgerId !== updateTransactionDto.ledgerId) {
        const hasAccessToNewLedger =
          await this.ledgerAccessService.doesUserHaveAccessToTransactionAction(
            updateTransactionDto.ledgerId,
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

    const updatedTransaction = await this.transactionService.update(
      id,
      updateTransactionDto,
    );

    if (!updatedTransaction) {
      throw new UnprocessableEntityException('Unable to update transaction');
    }

    return updatedTransaction;
  }

  @Delete(API_ROUTES.TRANSACTION.DELETE)
  async remove(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<TransactionEntity> {
    const transaction = await this.transactionService.findOne(id);
    if (!transaction) {
      throw new NotFoundException(
        this.i18n.t('errorMessages.transaction.notFound'),
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

    const deletedTransaction = await this.transactionService.remove(id);
    if (!deletedTransaction) {
      throw new UnprocessableEntityException('Unable to delete transaction');
    }
    return deletedTransaction;
  }
}
