import {
  CreateAccountSchema,
  TransferSchema,
  UpdateAccountSchema,
} from '@shared/schemas/account.schemas';
import { AccountEntity } from '@shared/types/account.type';
import { createZodDto } from 'nestjs-zod';

export class CreateAccountDto extends createZodDto(CreateAccountSchema) {}

export class UpdateAccountDto extends createZodDto(UpdateAccountSchema) {}

export class TransferDto extends createZodDto(TransferSchema) {}

export type AccountDto = AccountEntity;
