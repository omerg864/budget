import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Response,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LedgerAccessRole } from '@shared/constants/ledger.constants';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import type { Response as ExpressResponse } from 'express';
import { keyBy } from 'lodash';
import { API_ROUTES } from '../../../../../shared/constants/routes.constants';
import { LedgerCategory } from '../../../../../shared/types/ledger.type';
import type { UserEntity } from '../../../../../shared/types/user.type';
import { generateLink } from '../../../../../shared/utils/route.utils';
import { ParseObjectIdPipe } from '../../../pipes/parse-object-id.pipe';
import { EmailService } from '../../modules/email/email.service';
import { AppI18nService } from '../../modules/i18n/app-i18n.service';
import { LedgerAccessDocument } from '../../modules/ledgerAccess/ledgerAccess.model';
import { LedgerAccessService } from '../../modules/ledgerAccess/ledgerAccess.service';
import { User } from '../auth/auth.decorator';
import { UserService } from '../user/user.service';
import {
  AddUserDto,
  CreateCategoryDto,
  CreateLedgerDto,
  UpdateCategoryDto,
  UpdateLedgerDto,
} from './ledger.dto';
import { Ledger } from './ledger.model';
import { LedgerService } from './ledger.service';

@Controller(generateLink({ route: [API_ROUTES.LEDGER.BASE] }))
export class LedgerController {
  private readonly logger = new Logger(LedgerController.name);
  constructor(
    private readonly ledgerService: LedgerService,
    private readonly ledgerAccessService: LedgerAccessService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly i18n: AppI18nService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuard)
  @Post(API_ROUTES.LEDGER.CREATE)
  async create(
    @User() user: UserEntity,
    @Body() createLedgerDto: CreateLedgerDto,
  ): Promise<Ledger> {
    const ledger = await this.ledgerService.create(createLedgerDto);
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
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
    const userAccess = await this.ledgerAccessService.findByLedgerIdAndUserId(
      ledgerId,
      userId,
    );
    if (!userAccess) {
      throw new NotFoundException(this.i18n.t('errorMessages.ledger.notFound'));
    }
    if (userAccess.role === LedgerAccessRole.OWNER) {
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
    const access = await this.ledgerAccessService.findByLedgerIdAndUserId(
      ledgerId,
      user.id,
    );
    return this.ledgerService.resolveLedger(ledger, {
      ledgerId: ledger.id,
      userId: user.id,
      role: access!.role,
    });
  }

  @UseGuards(AuthGuard)
  @Post(API_ROUTES.LEDGER.ADD_USER)
  async addUser(
    @User() user: UserEntity,
    @Param('id', ParseObjectIdPipe) ledgerId: string,
    @Body() addUserDto: AddUserDto,
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
    const targetUser = await this.userService.findByEmail(addUserDto.email);
    if (!targetUser) {
      throw new NotFoundException(this.i18n.t('errorMessages.user.notFound'));
    }

    let existingAccess = await this.ledgerAccessService.findByLedgerIdAndUserId(
      ledgerId,
      targetUser.id,
    );

    const ledger = (await this.ledgerService.findOne(ledgerId))!;
    if (existingAccess) {
      // User already has access
    } else {
      existingAccess = await this.ledgerAccessService.create({
        ledgerId,
        userId: targetUser.id,
        role: LedgerAccessRole.REQUESTED,
      });

      const token = this.ledgerAccessService.generateInviteToken(
        addUserDto.email,
        addUserDto.role,
        ledgerId,
      );

      const serverUrl = this.configService.get<string>('SERVER_URL');
      const link = generateLink({
        baseUrl: serverUrl,
        route: [
          `/${API_ROUTES.BASE}`,
          API_ROUTES.LEDGER.BASE,
          API_ROUTES.LEDGER.ACCEPT_SHARE,
        ],
        query: {
          token,
        },
      });

      await this.emailService.sendLedgerShareEmail(
        targetUser.email,
        ledger.name,
        link,
        targetUser.name,
      );
    }

    return this.ledgerService.resolveLedger(ledger, existingAccess);
  }

  @Get(API_ROUTES.LEDGER.ACCEPT_SHARE)
  async acceptShare(
    @Query('token') token: string,
    @Response() res: ExpressResponse,
  ): Promise<void> {
    if (!token) {
      throw new BadRequestException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }
    const clientUrl = this.configService.get<string>('CLIENT_URL');
    const { email, role, ledgerId } =
      this.ledgerAccessService.decryptInviteToken(token);

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(this.i18n.t('errorMessages.user.notFound'));
    }

    const ledger = await this.ledgerService.findOne(ledgerId);
    if (!ledger) {
      throw new NotFoundException(this.i18n.t('errorMessages.ledger.notFound'));
    }

    const existingAccess =
      await this.ledgerAccessService.findByLedgerIdAndUserId(ledgerId, user.id);

    if (!existingAccess) {
      throw new BadRequestException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }

    if (existingAccess.role !== role) {
      const newAccess = await this.ledgerAccessService.update(
        (existingAccess as unknown as LedgerAccessDocument).id,
        { role },
      );
      if (!newAccess) {
        throw new NotFoundException(
          this.i18n.t('errorMessages.ledger.notFound'),
        );
      }
    }

    return res.redirect(clientUrl!);
  }
}
