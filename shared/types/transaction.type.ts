import { SupportedCurrencies } from '../constants/currency.constants';
import type {
	TransactionPaymentType,
	TransactionType,
} from '../constants/transaction.constants';

export type TransactionEntity = {
	id: string;
	description: string;
	amount: number;
	currency: SupportedCurrencies;
	convertedAmount?: number;
	convertedCurrency?: SupportedCurrencies;
	paymentId: string;
	paymentType: TransactionPaymentType;
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
