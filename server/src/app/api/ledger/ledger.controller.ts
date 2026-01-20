import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { API_ROUTES } from '../../../../../shared/constants/routes.constants.js';
import type { UserEntity } from '../../../../../shared/types/user.type.js';
import { generateLink } from '../../../../../shared/utils/route.utils.js';
import { LEDGER_ACCESS } from '../../../constants/ledgerAccess.constants.js';
import { ParseObjectIdPipe } from '../../../pipes/parse-object-id.pipe.js';
import { AppI18nService } from '../../modules/i18n/app-i18n.service.js';
import { LedgerAccessService } from '../../modules/ledgerAccess/ledgerAccess.service.js';
import { User } from '../auth/auth.decorator.js';
import { CreateLedgerDto } from './ledger.dto.js';
import { Ledger } from './ledger.model.js';
import { LedgerService } from './ledger.service.js';

@Controller(generateLink({ route: [API_ROUTES.LEDGER.BASE] }))
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
    const ledger = await this.ledgerService.create(createLedgerDto);
    await this.ledgerAccessService.create({
      ledgerId: ledger.id,
      userId: user.id,
      role: LEDGER_ACCESS.OWNER,
    });
    return ledger;
  }

  @Get(API_ROUTES.LEDGER.FIND_ALL)
  async findAll(@User() user: UserEntity): Promise<Ledger[]> {
    const userLedgerAccesses = await this.ledgerAccessService.findByUserId(
      user.id,
    );
    return this.ledgerService.findByIds(
      userLedgerAccesses.map((l) => l.ledgerId),
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
    return this.ledgerService.findOne(ledgerId);
  }

  @Patch(API_ROUTES.LEDGER.UPDATE)
  async update(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) ledgerId: string,
    @Body() updateData: Partial<CreateLedgerDto>,
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
    return this.ledgerService.update(ledgerId, updateData);
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
    return this.ledgerService.remove(ledgerId);
  }
}
