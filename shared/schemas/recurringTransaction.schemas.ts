import { z } from 'zod';
import {
	TransactionRecurringFrequency,
	TransactionType,
} from '../constants/transaction.constants.js';

export const CreateRecurringTransactionSchema = z.object({
	description: z.string().min(1, 'Description is required'),
	amount: z.number(),
	creditId: z.string().min(1, 'Credit ID is required'),
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
		creditId: z.string().optional(),
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
				(!!data.ledgerId && !data.creditId) ||
				(!data.ledgerId && !!data.creditId)
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
