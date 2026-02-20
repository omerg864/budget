import { passkey } from '@better-auth/passkey';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConnectionToken } from '@nestjs/mongoose';
import { AuthModule as BetterAuthNestModule } from '@thallesp/nestjs-better-auth';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { Connection } from 'mongoose';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    BetterAuthNestModule.forRootAsync({
      imports: [ConfigModule, AuthModule],
      inject: [AuthService, getConnectionToken(), ConfigService],
      useFactory: (
        authService: AuthService,
        connection: Connection,
        configService: ConfigService,
      ) => {
        const db = connection.db;

        return {
          auth: betterAuth({
            database: mongodbAdapter(db as any),
            baseURL: configService.get<string>('BETTER_AUTH_URL'),
            secret: configService.get<string>('BETTER_AUTH_SECRET'),
            user: {
              additionalFields: {
                defaultLedgerId: { type: 'string', required: false },
              },
            },
            hooks: {},
            databaseHooks: {
              user: {
                create: {
                  after: async (user) => {
                    await authService.createDefaultLedger(user);
                  },
                },
              },
            },
            emailAndPassword: {
              enabled: true,
              requireEmailVerification: true,
              sendResetPassword: async ({ user, url }) => {
                await authService.handlePasswordReset(user, url);
              },
              resetPasswordTokenExpiresIn: 60 * 60 * 24 * 7, // 1 week
            },
            emailVerification: {
              sendVerificationEmail: async ({ user, url }) => {
                await authService.handleEmailVerification(user, url);
              },
              sendOnSignIn: true,
            },
            socialProviders: {
              google: {
                clientId: configService.get<string>('GOOGLE_CLIENT_ID')!,
                clientSecret: configService.get<string>(
                  'GOOGLE_CLIENT_SECRET',
                )!,
                mapProfileToUser: () => ({ emailVerified: true }),
              },
            },
            advanced: {
              cookiePrefix: 'better-auth',
              useSecureCookies: true,
              crossSubdomainCookies: {
                enabled: true,
                domain: configService.get<string>('BETTER_AUTH_URL'),
              },
            },
            trustedOrigins: [
              configService.get<string>('CLIENT_URL') ||
                'http://localhost:5173',
            ],
            plugins: [passkey()],
          }),
        };
      },
    }),
  ],
})
export class BetterAuthModule {}
