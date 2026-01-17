import { betterAuth } from 'better-auth';

const auth = betterAuth(undefined as any);

/**
 * UserEntity type from better-auth
 * Contains user information such as id, email, name, image, etc.
 */
export type UserEntity = typeof auth.$Infer.Session.user;
