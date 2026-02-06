import CurrencyAPI from '@everapi/currencyapi-js';
import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupportedCurrencies } from '@shared/constants/currency.constants';
import { DateTime } from 'luxon';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);
  private readonly currencyAPI: CurrencyAPI;
  private readonly cache = new Map<string, number>();

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('CURRENCY_API_KEY');
    this.currencyAPI = new CurrencyAPI(apiKey);
  }

  private getCacheKey(
    from: SupportedCurrencies,
    to: SupportedCurrencies,
  ): string {
    const now = DateTime.now();
    return `${from}-${to}-${now.toFormat('yyyy-MM-dd')}`;
  }

  private clearYesterdayRates() {
    const yesterday = DateTime.now().minus({ days: 1 });
    for (const key of this.cache.keys()) {
      if (key.endsWith(yesterday.toFormat('yyyy-MM-dd'))) {
        this.cache.delete(key);
      }
    }
  }

  private async cacheLatestRates(from: SupportedCurrencies) {
    const exchangeRate = await this.currencyAPI.latest({
      base_currency: from,
    });
    const data = exchangeRate.data as Record<
      SupportedCurrencies,
      { value: number }
    >;
    for (const [currency, rate] of Object.entries(data)) {
      this.cache.set(
        this.getCacheKey(from, currency as SupportedCurrencies),
        rate.value,
      );
    }
  }

  async getAllReversedExchangeRates(
    to: SupportedCurrencies,
  ): Promise<Record<SupportedCurrencies, number>> {
    this.clearYesterdayRates();
    await this.cacheLatestRates(to);
    const rates: Record<SupportedCurrencies, number> = {} as Record<
      SupportedCurrencies,
      number
    >;
    for (const currency of Object.values(SupportedCurrencies)) {
      const rate = await this.getExchangeRate(currency, to);
      rates[currency] = rate;
    }
    return rates;
  }

  async getAllExchangeRates(
    from: SupportedCurrencies,
  ): Promise<Record<SupportedCurrencies, number>> {
    this.clearYesterdayRates();
    await this.cacheLatestRates(from);
    const rates: Record<SupportedCurrencies, number> = {} as Record<
      SupportedCurrencies,
      number
    >;
    for (const currency of Object.values(SupportedCurrencies)) {
      const rate = await this.getExchangeRate(from, currency);
      rates[currency] = rate;
    }
    return rates;
  }

  async getExchangeRate(
    from: SupportedCurrencies,
    to: SupportedCurrencies,
  ): Promise<number> {
    const cacheKey = this.getCacheKey(from, to);
    const cachedRate = this.cache.get(cacheKey);

    this.clearYesterdayRates();

    if (from === to) {
      this.cache.set(cacheKey, 1);
      return 1;
    }

    if (cachedRate) {
      this.logger.debug(`Using cached exchange rate for ${from} to ${to}`);
      return cachedRate;
    }

    const reverseCacheKey = this.getCacheKey(to, from);
    const reverseCachedRate = this.cache.get(reverseCacheKey);
    if (reverseCachedRate) {
      this.logger.debug(
        `Using reverse cached exchange rate for ${from} to ${to}`,
      );
      const rate = 1 / reverseCachedRate;
      this.cache.set(cacheKey, rate);
      return rate;
    }

    this.logger.debug(`Fetching exchange rate for ${from} to ${to}`);
    await this.cacheLatestRates(from);

    const rate = this.cache.get(cacheKey);
    if (!rate) {
      throw new UnprocessableEntityException(
        `Exchange rate not found for ${from} to ${to}`,
      );
    }

    return rate;
  }
}
