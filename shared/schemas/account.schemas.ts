import { z } from 'zod';
import { AccountType } from '../constants/account.constants';
import { SupportedCurrencies } from '../constants/currency.constants';

export const CreateAccountSchema = z.object({
	name: z.string().min(1, 'Account name is required'),
	type: z.enum(AccountType),
	balance: z.number().default(0),
	ledgerId: z.string().min(1, 'Ledger ID is required'),
	currency: z.enum(SupportedCurrencies),
	ownerId: z.string().optional(),
	notes: z.string().optional(),
	color: z.string().default('#000000'),
});

export const UpdateAccountSchema = z.object({
	name: z.string().optional(),
	balance: z.number().optional(),
	ownerId: z.string().optional(),
	notes: z.string().optional(),
	color: z.string().optional(),
});

export type CreateAccountSchemaType = z.infer<typeof CreateAccountSchema>;
export type UpdateAccountSchemaType = z.infer<typeof UpdateAccountSchema>;
