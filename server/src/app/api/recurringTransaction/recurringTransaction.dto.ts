import { createZodDto } from 'nestjs-zod';
import {
  CreateRecurringTransactionSchema,
  UpdateRecurringTransactionSchema,
} from '../../../../../shared/schemas/recurringTransaction.schemas.js';

export class CreateRecurringTransactionDto extends createZodDto(
  CreateRecurringTransactionSchema,
) {}

export class UpdateRecurringTransactionDto extends createZodDto(
  UpdateRecurringTransactionSchema,
) {}
