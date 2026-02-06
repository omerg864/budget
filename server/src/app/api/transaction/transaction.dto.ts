import {
  CreateTransactionSchema,
  UpdateTransactionSchema,
} from '@shared/schemas/transaction.schemas';
import { createZodDto } from 'nestjs-zod';

export class CreateTransactionDto extends createZodDto(
  CreateTransactionSchema,
) {}
export class UpdateTransactionDto extends createZodDto(
  UpdateTransactionSchema,
) {}
