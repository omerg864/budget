import {
	TransactionRecurringFrequency,
	TransactionType,
} from '../constants/transaction.constants.js';

export type RecurringTransactionEntity = {
	id: string;
	description: string;
	amount: number;
	creditId: string;
	ledgerId: string;
	userId?: string;
	type: TransactionType;
	startDate: Date;
	category?: string;
	notes?: string;
	receiptImageId?: string;
	endDate?: Date;
	frequency: TransactionRecurringFrequency;
	createdAt: Date;
	updatedAt: Date;
};
