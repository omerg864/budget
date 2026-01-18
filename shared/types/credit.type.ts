import { CreditType } from '../constants/credit.constants.js';

export type CreditEntity = {
	id: string;
	name: string;
	amount: number;
	accountId: string;
	ledgerId: string;
	ownerId?: string;
	type: CreditType;
	createdAt: Date;
	updatedAt: Date;
	deletedAt?: Date | null;
};
