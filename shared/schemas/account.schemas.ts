import { z } from 'zod';
import { AccountType } from '../constants/account.constants.js';

export const CreateAccountSchema = z.object({
	name: z.string().min(1, 'Account name is required'),
	type: z.enum(AccountType),
	balance: z.number().default(0),
	ledgerId: z.string().min(1, 'Ledger ID is required'),
	notes: z.string().optional(),
});

export const UpdateAccountSchema = z.object({
	name: z.string().optional(),
	balance: z.number().optional(),
	notes: z.string().optional(),
});
