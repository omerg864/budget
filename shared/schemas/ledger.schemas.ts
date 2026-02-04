import { SupportedIcons } from '@shared/constants/ledger.constants';
import { z } from 'zod';
import { SupportedCurrencies } from '../constants/currency.constants.js';
import { TransactionType } from '../constants/transaction.constants';

export const CreateLedgerSchema = z.object({
	name: z.string().min(1, 'Ledger name is required'),
	categories: z.array(
		z.object({
			id: z.string().optional(),
			name: z.string().min(1, 'Category name is required'),
			color: z.string().min(1, 'Category color is required'),
			type: z.enum(TransactionType),
			imageId: z.string().optional(),
			icon: z.string().optional(),
		}),
	),
	icon: z.enum(SupportedIcons),
	color: z.string().min(1, 'Color is required'),
	currency: z.enum(SupportedCurrencies),
});

export const UpdateLedgerSchema = z.object({
	name: z.string().min(1, 'Ledger name is required').optional(),
	categories: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().min(1, 'Category name is required'),
				color: z.string().min(1, 'Category color is required'),
				type: z.enum(TransactionType),
				imageId: z.string().optional(),
				icon: z.string().optional(),
			}),
		)
		.optional(),
	icon: z.enum(SupportedIcons).optional(),
	currency: z.enum(SupportedCurrencies).optional(),
});

export type CreateLedgerDto = z.infer<typeof CreateLedgerSchema>;
export type UpdateLedgerDto = z.infer<typeof UpdateLedgerSchema>;
export type CreateLedgerSchemaType = CreateLedgerDto;
