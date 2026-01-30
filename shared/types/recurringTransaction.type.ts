import { SupportedCurrencies } from '../constants/currency.constants';
import {
	TransactionPaymentType,
	TransactionRecurringFrequency,
	TransactionType,
} from '../constants/transaction.constants';

export type RecurringTransactionEntity = {
	id: string;
	description: string;
	amount: number;
	currency: SupportedCurrencies;
	paymentId: string;
	paymentType: TransactionPaymentType;
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
