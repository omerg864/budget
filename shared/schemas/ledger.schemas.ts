import { SupportedIcons } from '@shared/constants/ledger.constants';
import { z } from 'zod';
import { SupportedCurrencies } from '../constants/currency.constants.js';
import { TransactionType } from '../constants/transaction.constants';

export const CategorySchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, 'Category name is required'),
	color: z.string().min(1, 'Category color is required'),
	type: z.enum(TransactionType),
	imageId: z.string().optional(),
	icon: z.string(),
});

export const CreateCategorySchema = CategorySchema;
export const UpdateCategorySchema = CategorySchema.partial();

export const CreateLedgerSchema = z.object({
	name: z.string().min(1, 'Ledger name is required'),
	icon: z.enum(SupportedIcons),
	color: z.string().min(1, 'Color is required'),
	currency: z.enum(SupportedCurrencies),
});

export const UpdateLedgerSchema = z.object({
	name: z.string().min(1, 'Ledger name is required').optional(),
	icon: z.enum(SupportedIcons).optional(),
	currency: z.enum(SupportedCurrencies).optional(),
});

export type CategoryDto = z.infer<typeof CategorySchema>;
export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;

export type CreateLedgerDto = z.infer<typeof CreateLedgerSchema>;
export type UpdateLedgerDto = z.infer<typeof UpdateLedgerSchema>;
export type CreateLedgerSchemaType = CreateLedgerDto;
