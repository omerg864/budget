import { AccountType } from '../constants/account.constants.js';

export type AccountEntity = {
	id: string;
	name: string;
	type: AccountType;
	balance: number;
	ledgerId: string;
	notes?: string;
	createdAt: Date;
	updatedAt: Date;
};
