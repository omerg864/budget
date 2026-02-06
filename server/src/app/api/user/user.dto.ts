import { UpdateUserSchema } from '@shared/schemas/user.schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
