import { z } from 'zod';
import { SupportedCurrencies } from '../constants/currency.constants';
import {
	TransactionPaymentType,
	TransactionRecurringFrequency,
	TransactionType,
} from '../constants/transaction.constants';

export const CreateRecurringTransactionSchema = z.object({
	description: z.string().min(1, 'Description is required'),
	amount: z.number(),
	currency: z.enum(SupportedCurrencies),
	paymentId: z.string().min(1, 'Payment ID is required'),
	paymentType: z.enum(TransactionPaymentType),
	ledgerId: z.string().min(1, 'Ledger ID is required'),
	type: z.enum(TransactionType),
	startDate: z.coerce.date(),
	category: z.string().optional(),
	notes: z.string().optional(),
	receiptImageId: z.string().optional(),
	frequency: z.enum(TransactionRecurringFrequency),
	endDate: z.coerce.date().optional(),
});

export const UpdateRecurringTransactionSchema = z
	.object({
		description: z.string().optional(),
		amount: z.number().optional(),
		currency: z.enum(SupportedCurrencies),
		paymentId: z.string().optional(),
		paymentType: z.enum(TransactionPaymentType).optional(),
		ledgerId: z.string().optional(),
		type: z.enum(TransactionType).optional(),
		startDate: z.coerce.date().optional(),
		category: z.string().optional(),
		notes: z.string().optional(),
		receiptImageId: z.string().optional(),
		frequency: z.enum(TransactionRecurringFrequency).optional(),
		endDate: z.coerce.date().optional(),
	})
	.refine(
		(data) => {
			if (
				(!!data.ledgerId && !data.paymentId) ||
				(!data.ledgerId && !!data.paymentId)
			) {
				return false;
			}
			return true;
		},
		{
			message: 'Credit ID or Ledger ID is required',
			path: ['creditId', 'ledgerId'],
		},
	);
