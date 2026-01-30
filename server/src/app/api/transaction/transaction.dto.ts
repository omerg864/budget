import { createZodDto } from 'nestjs-zod';
import {
  CreateTransactionSchema,
  UpdateTransactionSchema,
} from '../../../../../shared/schemas/transaction.schemas';

export class CreateTransactionDto extends createZodDto(
  CreateTransactionSchema,
) {}
export class UpdateTransactionDto extends createZodDto(
  UpdateTransactionSchema,
) {}
