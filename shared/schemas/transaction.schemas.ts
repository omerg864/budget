import { z } from 'zod';
import { TransactionType } from '../constants/transaction.constants.js';

export const CreateTransactionSchema = z.object({
	description: z.string().min(1, 'Description is required'),
	amount: z.number(),
	creditId: z.string().min(1, 'Credit ID is required'),
	ledgerId: z.string().min(1, 'Ledger ID is required'),
	type: z.enum(TransactionType),
	date: z.coerce.date(),
	category: z.string().optional(),
	notes: z.string().optional(),
});

export const UpdateTransactionSchema = z
	.object({
		description: z.string().optional(),
		creditId: z.string().optional(),
		ledgerId: z.string().optional(),
		amount: z.number().optional(),
		type: z.enum(TransactionType).optional(),
		date: z.coerce.date().optional(),
		category: z.string().optional(),
		notes: z.string().optional(),
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
