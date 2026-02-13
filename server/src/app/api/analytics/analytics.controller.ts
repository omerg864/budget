import {
  Controller,
  Get,
  Param,
  ParseDatePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { API_ROUTES } from '@shared/constants/routes.constants';
import { AnalyticsService } from './analytics.service';

@Controller(API_ROUTES.ANALYTICS.BASE)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get(API_ROUTES.ANALYTICS.GET_MONTHLY)
  async getMonthly(
    @Param('ledgerId') ledgerId: string,
    @Query('start', new ParseDatePipe()) start: Date,
    @Query('end', new ParseDatePipe()) end: Date,
  ) {
    return this.analyticsService.getMonthlyAnalytics(ledgerId, start, end);
  }

  @Get(API_ROUTES.ANALYTICS.GET_YEARLY)
  async getYearly(
    @Param('ledgerId') ledgerId: string,
    @Query('start', new ParseIntPipe()) start: number,
    @Query('end', new ParseIntPipe()) end: number,
  ) {
    return this.analyticsService.getYearlyAnalytics(ledgerId, start, end);
  }
}
