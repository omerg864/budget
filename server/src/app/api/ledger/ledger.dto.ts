import { createZodDto } from 'nestjs-zod';
import { CreateLedgerSchema } from '../../../../../shared/schemas/ledger.schemas.js';
import { LedgerEntity } from '../../../../../shared/types/ledger.type.js';

export class CreateLedgerDto extends createZodDto(CreateLedgerSchema) {}

export type LedgerDto = LedgerEntity;
