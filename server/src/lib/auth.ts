import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

let client: MongoClient;

function getClient(): MongoClient {
  if (!client) {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    client = new MongoClient(mongoUri);
  }
  return client;
}

export const auth = betterAuth({
  database: mongodbAdapter(getClient().db()),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
  },
  trustedOrigins: [process.env.CLIENT_URL || 'http://localhost:5173'],
});

export type Session = typeof auth.$Infer.Session.session;
