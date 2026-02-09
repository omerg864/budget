import { passkey } from '@better-auth/passkey';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Add this
import { getConnectionToken } from '@nestjs/mongoose';
import { AuthModule as BetterAuthNestModule } from '@thallesp/nestjs-better-auth';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { Connection } from 'mongoose';
import { EmailModule } from '../../modules/email/email.module';
import { AppI18nModule } from '../../modules/i18n/app-i18n.module';
import { LedgerAccessModule } from '../../modules/ledgerAccess/ledgerAccess.module';
import { LedgerModule } from '../ledger/ledger.module';
import { UserModule } from '../user/user.module';
import { AuthHookService } from './auth-hooks.service';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UserModule,
    LedgerModule,
    LedgerAccessModule,
    EmailModule,
    AppI18nModule,
    BetterAuthNestModule.forRootAsync({
      imports: [ConfigModule, AuthModule],
      inject: [AuthService, getConnectionToken(), ConfigService],
      useFactory: (
        authService: AuthService,
        connection: Connection,
        configService: ConfigService, // Add to arguments
      ) => {
        const db = connection.db;

        return {
          auth: betterAuth({
            database: mongodbAdapter(db!),
            secret: configService.get<string>('BETTER_AUTH_SECRET'),
            hooks: {},
            user: {
              additionalFields: {
                defaultLedgerId: { type: 'string', required: false },
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
  providers: [AuthHookService],
})
export class BetterAuthModule {}
