import { z } from 'zod';
import { CreditType } from '../constants/credit.constants.js';

export const CreateCreditSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	accountId: z.string().min(1, 'Account ID is required'),
	ledgerId: z.string().min(1, 'Ledger ID is required'),
	ownerId: z.string().optional(),
	type: z.enum(CreditType),
});

export const UpdateCreditSchema = z
	.object({
		name: z.string().min(1, 'Name is required').optional(),
		accountId: z.string().optional(),
		ledgerId: z.string().optional(),
		ownerId: z.string().optional(),
	})
	.refine(
		(data) => {
			if (
				(!!data.ledgerId && !data.accountId) ||
				(!data.ledgerId && !!data.accountId)
			) {
				return false;
			}
			return true;
		},
		{
			message: 'Account ID or Ledger ID is required',
			path: ['accountId', 'ledgerId'],
		},
	);
