import { SupportedCurrencies } from '@shared/constants/currency.constants';

export const formatCurrency = (
	value: number,
	currency: string = SupportedCurrencies.ILS,
) => {
	return new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency,
		currencyDisplay: 'narrowSymbol',
	}).format(value);
};
