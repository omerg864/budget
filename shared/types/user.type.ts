import type { SupportedCurrencies } from '../constants/currency.constants.ts';

export type UserEntity = {
	name: string;
	email: string;
	image?: string;
	id: string;
	defaultLedgerId: string;
	defaultCurrency: SupportedCurrencies;
	createdAt: Date;
	updatedAt: Date;
};
