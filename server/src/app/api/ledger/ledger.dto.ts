import { createZodDto } from 'nestjs-zod';

import {
  AddUserSchema,
  CreateCategorySchema,
  CreateLedgerSchema,
  UpdateCategorySchema,
  UpdateLedgerSchema,
} from '@shared/schemas/ledger.schemas';
import { LedgerEntity } from '@shared/types/ledger.type';

export class CreateLedgerDto extends createZodDto(CreateLedgerSchema) {}
export class UpdateLedgerDto extends createZodDto(UpdateLedgerSchema) {}
export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}
export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}
export class AddUserDto extends createZodDto(AddUserSchema) {}

export type LedgerDto = LedgerEntity;
