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
import { AccountEntity } from '../../../../../shared/types/account.type';
import type { UserEntity } from '../../../../../shared/types/user.type';
import { generateLink } from '../../../../../shared/utils/route.utils';
import { ParseObjectIdPipe } from '../../../pipes/parse-object-id.pipe';
import { AppI18nService } from '../../modules/i18n/app-i18n.service';
import { LedgerAccessService } from '../../modules/ledgerAccess/ledgerAccess.service';
import { User } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { CreateAccountDto, UpdateAccountDto } from './account.dto';
import { AccountService } from './account.service';

@Controller(generateLink({ route: [API_ROUTES.ACCOUNT.BASE] }))
@UseGuards(AuthGuard)
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly ledgerAccessService: LedgerAccessService,
    private readonly i18n: AppI18nService,
  ) {}

  @Post(API_ROUTES.ACCOUNT.CREATE)
  async create(
    @User() user: UserEntity,
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<AccountEntity> {
    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToAccountAction(
        createAccountDto.ledgerId,
        user.id,
        'write',
      );

    if (!hasAccess) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }

    return this.accountService.create(createAccountDto);
  }

  @Get(API_ROUTES.ACCOUNT.FIND_ALL)
  async findAll(
    @User() user: UserEntity,
    @Param('ledgerId', ParseObjectIdPipe) ledgerId: string,
  ): Promise<AccountEntity[]> {
    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToAccountAction(
        ledgerId,
        user.id,
        'read',
      );

    if (!hasAccess) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }

    return this.accountService.findByLedgerId(ledgerId);
  }

  @Get(API_ROUTES.ACCOUNT.FIND_ONE)
  async findOne(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) accountId: string,
  ): Promise<AccountEntity | null> {
    const account = await this.accountService.findOne(accountId);
    if (!account) {
      throw new NotFoundException(
        this.i18n.t('errorMessages.account.notFound'),
      );
    }

    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToAccountAction(
        account.ledgerId,
        user.id,
        'read',
      );

    if (!hasAccess) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }

    return account;
  }

  @Patch(API_ROUTES.ACCOUNT.UPDATE)
  async update(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) accountId: string,
    @Body() updateData: UpdateAccountDto,
  ): Promise<AccountEntity | null> {
    const account = await this.accountService.findOne(accountId);
    if (!account) {
      throw new NotFoundException(
        this.i18n.t('errorMessages.account.notFound'),
      );
    }

    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToAccountAction(
        account.ledgerId,
        user.id,
        'write',
      );

    if (!hasAccess) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }

    return this.accountService.update(accountId, updateData);
  }

  @Delete(API_ROUTES.ACCOUNT.DELETE)
  async remove(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) accountId: string,
  ): Promise<AccountEntity | null> {
    const account = await this.accountService.findOne(accountId);
    if (!account) {
      throw new NotFoundException(
        this.i18n.t('errorMessages.account.notFound'),
      );
    }

    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToAccountAction(
        account.ledgerId,
        user.id,
        'delete',
      );

    if (!hasAccess) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }

    return this.accountService.remove(accountId);
  }
}
