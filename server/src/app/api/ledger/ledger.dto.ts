import { createZodDto } from 'nestjs-zod';
import { CreateLedgerSchema } from '../../../../../shared/schemas/ledger.schemas';
import { LedgerEntity } from '../../../../../shared/types/ledger.type';

export class CreateLedgerDto extends createZodDto(CreateLedgerSchema) {}

export type LedgerDto = LedgerEntity;
