export enum SupportedCurrencies {
	ILS = 'ILS',
	USD = 'USD',
	EUR = 'EUR',
	GBP = 'GBP',
	CHF = 'CHF',
	JPY = 'JPY',
}

export const SupportedCurrencyData: Record<
	SupportedCurrencies,
	{
		value: SupportedCurrencies;
		symbol: string;
	}
> = {
	[SupportedCurrencies.ILS]: {
		value: SupportedCurrencies.ILS,
		symbol: '₪',
	},
	[SupportedCurrencies.USD]: {
		value: SupportedCurrencies.USD,
		symbol: '$',
	},
	[SupportedCurrencies.EUR]: {
		value: SupportedCurrencies.EUR,
		symbol: '€',
	},
	[SupportedCurrencies.GBP]: {
		value: SupportedCurrencies.GBP,
		symbol: '£',
	},
	[SupportedCurrencies.CHF]: {
		value: SupportedCurrencies.CHF,
		symbol: '₣',
	},
	[SupportedCurrencies.JPY]: {
		value: SupportedCurrencies.JPY,
		symbol: '¥',
	},
};
