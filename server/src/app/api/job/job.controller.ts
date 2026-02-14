import { Controller, Get, UseGuards } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { DateTime } from 'luxon';
import { API_ROUTES } from '../../../../../shared/constants/routes.constants';
import { generateLink } from '../../../../../shared/utils/route.utils';
import { ApiKeyGuard } from '../../api/auth/guards/api-key.guard';
import { JobService } from './job.service';

@Controller(generateLink({ route: [API_ROUTES.JOB.BASE] }))
@AllowAnonymous()
@UseGuards(ApiKeyGuard)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get(API_ROUTES.JOB.CREATE_RECURRING_TRANSACTIONS)
  async createRecurringTransactionsOfToday() {
    await this.jobService.createRecurringTransactionsOfToday();
    return { status: 'success' };
  }

  @Get(API_ROUTES.JOB.CHARGE_CREDITS_OF_MONTH)
  async chargeCreditsOfMonth() {
    await this.jobService.chargeCreditsOfMonth();
    return { status: 'success' };
  }

  @Get(API_ROUTES.JOB.CALCULATE_ANALYTICS_MONTHLY)
  async calculateAnalyticsMonthly() {
    const previousMonth = DateTime.now().minus({ months: 1 }).toJSDate();
    await this.jobService.calculateAllMonthlyAnalytics(previousMonth);
    return { status: 'success' };
  }

  @Get(API_ROUTES.JOB.MONTHLY_JOB)
  async monthlyJob() {
    const runJobs = async () => {
      await this.jobService.chargeCreditsOfMonth();
      const previousMonth = DateTime.now().minus({ months: 1 }).toJSDate();
      await this.jobService.calculateAllMonthlyAnalytics(previousMonth);
    };
    await runJobs();
    return { status: 'success' };
  }

  @Get(API_ROUTES.JOB.CALCULATE_ANALYTICS_YEARLY)
  async calculateAnalyticsYearly() {
    const previousYear = DateTime.now().minus({ years: 1 }).year;
    await this.jobService.calculateAllYearlyAnalytics(previousYear);
    return { status: 'success' };
  }
}
