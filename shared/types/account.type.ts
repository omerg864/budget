import { AccountType } from '../constants/account.constants.js';
import type { SupportedCurrencies } from '../constants/currency.constants.js';

export type AccountEntity = {
	id: string;
	name: string;
	type: AccountType;
	balance: number;
	color: string;
	currency: SupportedCurrencies;
	ledgerId: string;
	ownerId?: string;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date | null;
};
