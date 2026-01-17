import { createZodDto } from 'nestjs-zod';
import { CreateAccountSchema } from '../../../../../shared/schemas/account.schemas.js';
import { AccountEntity } from '../../../../../shared/types/account.type.js';

export class CreateAccountDto extends createZodDto(CreateAccountSchema) {}

export type AccountDto = AccountEntity;
