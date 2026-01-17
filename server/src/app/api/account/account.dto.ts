import { createZodDto } from 'nestjs-zod';
import {
  CreateAccountSchema,
  UpdateAccountSchema,
} from '../../../../../shared/schemas/account.schemas.js';
import { AccountEntity } from '../../../../../shared/types/account.type.js';

export class CreateAccountDto extends createZodDto(CreateAccountSchema) {}

export class UpdateAccountDto extends createZodDto(UpdateAccountSchema) {}

export type AccountDto = AccountEntity;
