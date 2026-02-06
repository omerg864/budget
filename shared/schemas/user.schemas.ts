import { z } from 'zod';

export const UpdateUserSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
});

export type UpdateUserSchemaType = z.infer<typeof UpdateUserSchema>;
