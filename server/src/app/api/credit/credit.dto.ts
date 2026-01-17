import { createZodDto } from 'nestjs-zod';
import {
  CreateCreditSchema,
  UpdateCreditSchema,
} from '../../../../../shared/schemas/credit.schemas.js';
import { CreditEntity } from '../../../../../shared/types/credit.type.js';

export class CreateCreditDto extends createZodDto(CreateCreditSchema) {}

export class UpdateCreditDto extends createZodDto(UpdateCreditSchema) {}

export type CreditDto = CreditEntity;
