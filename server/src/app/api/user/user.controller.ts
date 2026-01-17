import { Controller, Get, UseGuards } from '@nestjs/common';
import { API_ROUTES } from '../../../../../shared/constants/routes.constants.js';
import type { UserEntity } from '../../../../../shared/types/user.type';
import { generateLink } from '../../../../../shared/utils/route.utils.js';
import { User } from '../auth/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';

@Controller(generateLink({ route: [API_ROUTES.USER.BASE] }))
@UseGuards(AuthGuard)
export class UserController {
  @Get(API_ROUTES.USER.ME)
  getMe(@User() user: UserEntity) {
    return {
      user,
    };
  }
}
