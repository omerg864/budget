import { createZodDto } from 'nestjs-zod';
import {
  CreateAccountSchema,
  UpdateAccountSchema,
} from '../../../../../shared/schemas/account.schemas';
import { AccountEntity } from '../../../../../shared/types/account.type';

export class CreateAccountDto extends createZodDto(CreateAccountSchema) {}

export class UpdateAccountDto extends createZodDto(UpdateAccountSchema) {}

export type AccountDto = AccountEntity;
