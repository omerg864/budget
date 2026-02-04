import { createZodDto } from 'nestjs-zod';
import {
  CreateLedgerSchema,
  UpdateLedgerSchema,
} from '../../../../../shared/schemas/ledger.schemas';
import { LedgerEntity } from '../../../../../shared/types/ledger.type';

export class CreateLedgerDto extends createZodDto(CreateLedgerSchema) {}
export class UpdateLedgerDto extends createZodDto(UpdateLedgerSchema) {}

export type LedgerDto = LedgerEntity;
