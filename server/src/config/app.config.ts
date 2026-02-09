import { z } from 'zod';
import { NODE_ENV } from '../constants/app.constants';

export const configurationSchema = z.object({
  NODE_ENV: z.enum(NODE_ENV).default(NODE_ENV.DEVELOPMENT),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  SERVER_URL: z.string().default('http://localhost:3000'),
  PORT: z.coerce.number().default(3000),
});

export type Configuration = z.infer<typeof configurationSchema>;

export default () => {
  const result = configurationSchema.safeParse(process.env);

  if (!result.success) {
    console.error(
      '❌ Invalid environment variables:',
      JSON.stringify(z.treeifyError(result.error)),
    );
    throw new Error('Invalid environment variables');
  }

  return result.data;
};
