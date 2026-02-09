import { Controller, Post, UseGuards } from '@nestjs/common';
import { API_ROUTES } from '../../../../../shared/constants/routes.constants';
import { generateLink } from '../../../../../shared/utils/route.utils';
import { ApiKeyGuard } from '../../api/auth/guards/api-key.guard';
import { JobService } from './job.service';

@Controller(generateLink({ route: [API_ROUTES.JOB.BASE] }))
@UseGuards(ApiKeyGuard)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post(API_ROUTES.JOB.CREATE_RECURRING_TRANSACTIONS)
  async createRecurringTransactionsOfToday() {
    await this.jobService.createRecurringTransactionsOfToday();
    return { status: 'success' };
  }

  @Post(API_ROUTES.JOB.CHARGE_CREDITS_OF_MONTH)
  async chargeCreditsOfMonth() {
    await this.jobService.chargeCreditsOfMonth();
    return { status: 'success' };
  }
}
