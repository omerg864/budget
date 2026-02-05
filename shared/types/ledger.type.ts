import type { SupportedCurrencies } from '@shared/constants/currency.constants.ts';
import type {
	LedgerAccessRole,
	SupportedIcons,
} from '@shared/constants/ledger.constants.ts';
import { TransactionType } from '../constants/transaction.constants';

export type LedgerCategory = {
	id: string;
	name: string;
	color: string;
	type: TransactionType;
	imageId?: string;
	icon?: string;
};

export type LedgerUser = {
	id: string;
	name: string;
	email: string;
	role: LedgerAccessRole;
};

export type LedgerEntity = {
	id: string;
	name: string;
	categories: LedgerCategory[];
	icon: SupportedIcons;
	color: string;
	currency: SupportedCurrencies;
	access?: LedgerAccessRole;
};
