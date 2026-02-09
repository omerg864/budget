import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LedgerUser } from '@shared/types/ledger.type.js';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { keyBy } from 'lodash';
import { API_ROUTES } from '../../../../../shared/constants/routes.constants';
import type { UserEntity } from '../../../../../shared/types/user.type';
import { generateLink } from '../../../../../shared/utils/route.utils';
import { ParseObjectIdPipe } from '../../../pipes/parse-object-id.pipe';
import { AppI18nService } from '../../modules/i18n/app-i18n.service';
import { LedgerAccessService } from '../../modules/ledgerAccess/ledgerAccess.service';
import { User } from '../auth/auth.decorator';
import { UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller(generateLink({ route: [API_ROUTES.USER.BASE] }))
@UseGuards(AuthGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(
    private readonly userService: UserService,
    private readonly ledgerAccessService: LedgerAccessService,
    private readonly i18n: AppI18nService,
  ) {}

  @Get(API_ROUTES.USER.ME)
  async getMe(@User() user: UserEntity): Promise<{ user: UserEntity }> {
    const userEntity = await this.userService.findOne(user.id);

    if (!userEntity) {
      throw new NotFoundException(this.i18n.t('errorMessages.user.notFound'));
    }
    return {
      user: userEntity,
    };
  }

  @Get(API_ROUTES.USER.LEDGER)
  async getUsersByLedger(
    @User() user: UserEntity,
    @Param('ledgerId', ParseObjectIdPipe) ledgerId: string,
  ): Promise<{ users: LedgerUser[] }> {
    const hasAccess =
      await this.ledgerAccessService.doesUserHaveAccessToUserAction(
        ledgerId,
        user.id,
        'read',
      );

    if (!hasAccess) {
      throw new UnauthorizedException(
        this.i18n.t('errorMessages.ledger.accessDenied'),
      );
    }

    const ledgerAccesses =
      await this.ledgerAccessService.getByLedgerId(ledgerId);
    const keyedAccess = keyBy(ledgerAccesses, 'userId');
    const userIds = ledgerAccesses.map((ledgerAccess) => ledgerAccess.userId);
    const users = await this.userService.findAll(userIds);
    return {
      users: users.map((user) =>
        this.userService.resolveUser(user, keyedAccess[user.id].role),
      ),
    };
  }

  @Patch(API_ROUTES.USER.UPDATE)
  async updateMe(
    @User() user: UserEntity,
    @Body() body: UpdateUserDto,
  ): Promise<{ user: UserEntity }> {
    const updatedUser = await this.userService.update(user.id, body);
    if (!updatedUser) {
      throw new NotFoundException(this.i18n.t('errorMessages.user.notFound'));
    }
    return {
      user: updatedUser,
    };
  }
}
