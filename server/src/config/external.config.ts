import z from 'zod';

export const configurationSchema = z.object({
  CURRENCY_API_KEY: z.string(),
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
