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
import { LedgerAccessRole } from '@shared/constants/ledger.constants';
import { keyBy } from 'lodash';
import { API_ROUTES } from '../../../../../shared/constants/routes.constants';
import { LedgerCategory } from '../../../../../shared/types/ledger.type';
import type { UserEntity } from '../../../../../shared/types/user.type';
import { generateLink } from '../../../../../shared/utils/route.utils';
import { ParseObjectIdPipe } from '../../../pipes/parse-object-id.pipe';
import { AppI18nService } from '../../modules/i18n/app-i18n.service';
import { LedgerAccessService } from '../../modules/ledgerAccess/ledgerAccess.service';
import { User } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import {
  CreateCategoryDto,
  CreateLedgerDto,
  UpdateCategoryDto,
  UpdateLedgerDto,
} from './ledger.dto';
import { Ledger } from './ledger.model';
import { LedgerService } from './ledger.service';

@Controller(generateLink({ route: [API_ROUTES.LEDGER.BASE] }))
@UseGuards(AuthGuard)
export class LedgerController {
  constructor(
    private readonly ledgerService: LedgerService,
    private readonly ledgerAccessService: LedgerAccessService,
    private readonly i18n: AppI18nService,
  ) {}

  @Post(API_ROUTES.LEDGER.CREATE)
  async create(
    @User() user: UserEntity,
    @Body() createLedgerDto: CreateLedgerDto,
  ): Promise<Ledger> {
    const ledger = await this.ledgerService.create({
      ...createLedgerDto,
      categories: [],
    });
    await this.ledgerAccessService.create({
      ledgerId: ledger.id,
      userId: user.id,
      role: LedgerAccessRole.OWNER,
    });
    return this.ledgerService.resolveLedger(ledger, {
      ledgerId: ledger.id,
      userId: user.id,
      role: LedgerAccessRole.OWNER,
    });
  }

  @Get(API_ROUTES.LEDGER.FIND_ALL)
  async findAll(@User() user: UserEntity): Promise<Ledger[]> {
    const userLedgerAccesses = await this.ledgerAccessService.findByUserId(
      user.id,
    );
    const keyedUserLedgerAccesses = keyBy(
      userLedgerAccesses,
      (l) => l.ledgerId,
    );
    const ledgers = await this.ledgerService.findByIds(
      userLedgerAccesses.map((l) => l.ledgerId),
    );
    return ledgers.map((ledger) =>
      this.ledgerService.resolveLedger(
        ledger,
        keyedUserLedgerAccesses[ledger.id],
      ),
    );
  }

  @Get(API_ROUTES.LEDGER.FIND_ONE)
  async findOne(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) ledgerId: string,
  ): Promise<Ledger | null> {
    const readAccess =
      await this.ledgerAccessService.doesUserHaveAccessToLedgerAction(
        ledgerId,
        user.id,
        'read',
      );
    if (!readAccess) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }
    const ledgerAccess =
      (await this.ledgerAccessService.findByLedgerIdAndUserId(
        ledgerId,
        user.id,
      ))!;
    const ledger = await this.ledgerService.findOne(ledgerId);
    if (!ledger) {
      throw new NotFoundException(this.i18n.t('errorMessages.ledger.notFound'));
    }
    return this.ledgerService.resolveLedger(ledger, ledgerAccess);
  }

  @Patch(API_ROUTES.LEDGER.UPDATE)
  async update(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) ledgerId: string,
    @Body() updateData: Partial<UpdateLedgerDto>,
  ): Promise<Ledger | null> {
    const writeAccess =
      await this.ledgerAccessService.doesUserHaveAccessToLedgerAction(
        ledgerId,
        user.id,
        'write',
      );
    if (!writeAccess) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }
    const ledgerAccess =
      (await this.ledgerAccessService.findByLedgerIdAndUserId(
        ledgerId,
        user.id,
      ))!;

    const updatedLedger = await this.ledgerService.update(ledgerId, {
      ...updateData,
    });
    if (!updatedLedger) {
      throw new NotFoundException(this.i18n.t('errorMessages.ledger.notFound'));
    }
    return this.ledgerService.resolveLedger(updatedLedger, ledgerAccess);
  }

  @Post(API_ROUTES.LEDGER.CREATE_CATEGORY)
  async createCategory(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) ledgerId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Ledger | null> {
    const writeAccess =
      await this.ledgerAccessService.doesUserHaveAccessToLedgerAction(
        ledgerId,
        user.id,
        'write',
      );
    if (!writeAccess) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }
    const ledgerAccess =
      (await this.ledgerAccessService.findByLedgerIdAndUserId(
        ledgerId,
        user.id,
      ))!;

    const updatedLedger = await this.ledgerService.addCategory(
      ledgerId,
      createCategoryDto as LedgerCategory,
    );

    if (!updatedLedger) {
      throw new NotFoundException(this.i18n.t('errorMessages.ledger.notFound'));
    }
    return this.ledgerService.resolveLedger(updatedLedger, ledgerAccess);
  }

  @Patch(API_ROUTES.LEDGER.UPDATE_CATEGORY)
  async updateCategory(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) ledgerId: string,
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Ledger | null> {
    const writeAccess =
      await this.ledgerAccessService.doesUserHaveAccessToLedgerAction(
        ledgerId,
        user.id,
        'write',
      );
    if (!writeAccess) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }
    const ledgerAccess =
      (await this.ledgerAccessService.findByLedgerIdAndUserId(
        ledgerId,
        user.id,
      ))!;

    const updatedLedger = await this.ledgerService.updateCategory(
      ledgerId,
      categoryId,
      updateCategoryDto as Partial<LedgerCategory>,
    );

    if (!updatedLedger) {
      throw new NotFoundException(this.i18n.t('errorMessages.ledger.notFound'));
    }
    return this.ledgerService.resolveLedger(updatedLedger, ledgerAccess);
  }

  @Delete(API_ROUTES.LEDGER.DELETE_CATEGORY)
  async deleteCategory(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) ledgerId: string,
    @Param('categoryId') categoryId: string,
  ): Promise<Ledger | null> {
    const writeAccess =
      await this.ledgerAccessService.doesUserHaveAccessToLedgerAction(
        ledgerId,
        user.id,
        'write',
      );
    if (!writeAccess) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }
    const ledgerAccess =
      (await this.ledgerAccessService.findByLedgerIdAndUserId(
        ledgerId,
        user.id,
      ))!;

    const updatedLedger = await this.ledgerService.removeCategory(
      ledgerId,
      categoryId,
    );

    if (!updatedLedger) {
      throw new NotFoundException(this.i18n.t('errorMessages.ledger.notFound'));
    }
    return this.ledgerService.resolveLedger(updatedLedger, ledgerAccess);
  }

  @Delete(API_ROUTES.LEDGER.DELETE)
  async remove(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) ledgerId: string,
  ): Promise<Ledger | null> {
    const ownerLedgerAccess =
      await this.ledgerAccessService.doesUserHaveAccessToLedgerAction(
        ledgerId,
        user.id,
        'delete',
      );
    if (!ownerLedgerAccess) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.ledger.deleteForbidden'),
      );
    }
    const removed = await this.ledgerService.remove(ledgerId);
    if (!removed) {
      throw new NotFoundException(this.i18n.t('errorMessages.ledger.notFound'));
    }
    return this.ledgerService.resolveLedger(removed, {
      ledgerId: removed.id,
      userId: user.id,
      role: LedgerAccessRole.OWNER,
    });
  }

  @Delete(API_ROUTES.LEDGER.REMOVE_USER)
  async removeUser(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) ledgerId: string,
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<Ledger | null> {
    const ledgerAccess =
      await this.ledgerAccessService.doesUserHaveAccessToLedgerAction(
        ledgerId,
        user.id,
        'write',
      );
    if (!ledgerAccess) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.ledger.deleteForbidden'),
      );
    }
    const access = await this.ledgerAccessService.findByLedgerIdAndUserId(
      ledgerId,
      userId,
    );
    if (!access) {
      throw new NotFoundException(this.i18n.t('errorMessages.ledger.notFound'));
    }
    if (access.role !== LedgerAccessRole.OWNER && user.id !== userId) {
      throw new ForbiddenException(
        this.i18n.t('errorMessages.ledger.deleteForbidden'),
      );
    }
    const removed = await this.ledgerAccessService.removeByLedgerIdAndUserId(
      ledgerId,
      userId,
    );
    if (!removed) {
      throw new NotFoundException(this.i18n.t('errorMessages.ledger.notFound'));
    }
    const ledger = await this.ledgerService.findOne(ledgerId);
    if (!ledger) {
      throw new NotFoundException(this.i18n.t('errorMessages.ledger.notFound'));
    }
    return this.ledgerService.resolveLedger(ledger, {
      ledgerId: ledger.id,
      userId: user.id,
      role: access.role,
    });
  }
}
