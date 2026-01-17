import { z } from 'zod';
import { TransactionType } from '../constants/transaction.constants.js';

export const CreateLedgerSchema = z.object({
	name: z.string().min(1, 'Ledger name is required'),
	categories: z.array(
		z.object({
			id: z.string(),
			name: z.string().min(1, 'Category name is required'),
			color: z.string().min(1, 'Category color is required'),
			type: z.enum(TransactionType),
			imageId: z.string().optional(),
			icon: z.string().optional(),
		}),
	),
});
