import z from 'zod';

export const configurationSchema = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.string().optional(),
  JOB_API_KEY: z.string().optional().default('DEFAULT_KEY'),
  SHARE_SECRET_KEY: z.string().optional().default('DEFAULT_KEY'),
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
