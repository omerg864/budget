import {
  Controller,
  Get,
  Query,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { SupportedCurrencies } from '../../../../../shared/constants/currency.constants';
import { API_ROUTES } from '../../../../../shared/constants/routes.constants';
import { generateLink } from '../../../../../shared/utils/route.utils';
import { CurrencyService } from '../../modules/currency/currency.service';
import { AppI18nService } from '../../modules/i18n/app-i18n.service';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
@Controller(generateLink({ route: [API_ROUTES.CURRENCY.BASE] }))
@UseGuards(AuthGuard)
export class CurrencyController {
  constructor(
    private readonly currencyService: CurrencyService,
    private readonly i18nService: AppI18nService,
  ) {}

  @Get(API_ROUTES.CURRENCY.GET_EXCHANGE_RATE)
  async getExchangeRate(
    @Query('from') from: SupportedCurrencies,
    @Query('to') to: SupportedCurrencies,
  ): Promise<number> {
    const supportedCurrencies = Object.values(SupportedCurrencies);
    if (
      !supportedCurrencies.includes(from) ||
      !supportedCurrencies.includes(to)
    ) {
      throw new UnprocessableEntityException(
        this.i18nService.t('errorMessages.currency.invalidCurrency'),
      );
    }
    return this.currencyService.getExchangeRate(from, to);
  }

  @Get(API_ROUTES.CURRENCY.GET_ALL_EXCHANGE_RATES)
  async getAllExchangeRates(
    @Query('from') from: SupportedCurrencies,
  ): Promise<Record<SupportedCurrencies, number>> {
    const supportedCurrencies = Object.values(SupportedCurrencies);
    if (!supportedCurrencies.includes(from)) {
      throw new UnprocessableEntityException(
        this.i18nService.t('errorMessages.currency.invalidCurrency'),
      );
    }
    return this.currencyService.getAllExchangeRates(from);
  }

  @Get(API_ROUTES.CURRENCY.GET_ALL_REVERSED_EXCHANGE_RATES)
  async getAllReversedExchangeRates(
    @Query('to') to: SupportedCurrencies,
  ): Promise<Record<SupportedCurrencies, number>> {
    const supportedCurrencies = Object.values(SupportedCurrencies);
    if (!supportedCurrencies.includes(to)) {
      throw new UnprocessableEntityException(
        this.i18nService.t('errorMessages.currency.invalidCurrency'),
      );
    }
    return this.currencyService.getAllReversedExchangeRates(to);
  }
}
