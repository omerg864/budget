import type { TransactionType } from '../constants/transaction.constants.js';

export type TransactionEntity = {
	id: string;
	description: string;
	amount: number;
	creditId: string;
	ledgerId: string;
	userId?: string;
	type: TransactionType;
	date: Date;
	category?: string;
	notes?: string;
	receiptImageId?: string;
	recurringTransactionId?: string;
	createdAt: Date;
	updatedAt: Date;
};
