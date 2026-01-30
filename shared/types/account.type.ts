import { AccountType } from '../constants/account.constants';
import type { SupportedCurrencies } from '../constants/currency.constants';

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
