import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { API_ROUTES } from '../../../../../shared/constants/routes.constants.js';
import type { UserEntity } from '../../../../../shared/types/user.type';
import { generateLink } from '../../../../../shared/utils/route.utils.js';
import { ParseObjectIdPipe } from '../../../pipes/parse-object-id.pipe.js';
import { AppI18nService } from '../../modules/i18n/app-i18n.service.js';
import { LedgerAccessService } from '../../modules/ledgerAccess/ledgerAccess.service.js';
import { User } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service.js';

@Controller(generateLink({ route: [API_ROUTES.USER.BASE] }))
@UseGuards(AuthGuard)
export class UserController {
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
  ): Promise<{ users: Partial<UserEntity>[] }> {
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
    const userIds = ledgerAccesses.map((ledgerAccess) => ledgerAccess.userId);
    const users = await this.userService.findAll(userIds);
    return {
      users: users.map((user) => this.userService.resolveUser(user)),
    };
  }
}
