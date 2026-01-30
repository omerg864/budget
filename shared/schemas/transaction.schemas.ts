import { z } from 'zod';
import { SupportedCurrencies } from '../constants/currency.constants';
import {
	TransactionPaymentType,
	TransactionType,
} from '../constants/transaction.constants';

export const CreateTransactionSchema = z.object({
	description: z.string(),
	amount: z.number(),
	currency: z.enum(SupportedCurrencies),
	convertedAmount: z.number().optional(),
	convertedCurrency: z.enum(SupportedCurrencies).optional(),
	paymentId: z.string().min(1, 'Payment method is required'),
	paymentType: z.enum(TransactionPaymentType),
	ledgerId: z.string().min(1, 'Ledger ID is required'),
	type: z.enum(TransactionType),
	date: z.coerce.date(),
	category: z.string().optional(),
	notes: z.string().optional(),
});

export const UpdateTransactionSchema = z
	.object({
		description: z.string().optional(),
		paymentId: z.string().optional(),
		paymentType: z.enum(TransactionPaymentType).optional(),
		ledgerId: z.string().optional(),
		amount: z.number().optional(),
		currency: z.enum(SupportedCurrencies).optional(),
		convertedAmount: z.number().optional(),
		convertedCurrency: z.enum(SupportedCurrencies).optional(),
		type: z.enum(TransactionType).optional(),
		date: z.coerce.date().optional(),
		category: z.string().optional(),
		notes: z.string().optional(),
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
			message: 'Payment ID or Ledger ID is required',
			path: ['paymentId', 'ledgerId'],
		},
	);

export type CreateTransactionSchemaType = z.infer<
	typeof CreateTransactionSchema
>;
export type UpdateTransactionSchemaType = z.infer<
	typeof UpdateTransactionSchema
>;
