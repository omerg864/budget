import { TransactionType } from '../constants/transaction.constants';

export type LedgerCategory = {
	id: string;
	name: string;
	color: string;
	type: TransactionType;
	imageId?: string;
	icon?: string;
};

export type LedgerEntity = {
	id: string;
	name: string;
	categories: LedgerCategory[];
};
