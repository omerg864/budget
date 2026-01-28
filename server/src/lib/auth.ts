import { passkey } from '@better-auth/passkey';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient, ObjectId } from 'mongodb';
import { LEDGER_ACCESS } from '../constants/ledgerAccess.constants.js';

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
  databaseHooks: {
    user: {
      create: {
        // Runs AFTER the user is saved to MongoDB
        after: async (user) => {
          const db = getClient().db();
          const ledgerResult = await db.collection('ledgers').insertOne({
            name: 'Default Ledger',
            categories: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          await db.collection('user').updateOne(
            { _id: new ObjectId(user.id) },
            {
              $set: {
                defaultLedgerId: ledgerResult.insertedId,
              },
            },
          );
          await db.collection('ledgeraccesses').insertOne({
            userId: user.id,
            ledgerId: ledgerResult.insertedId.toString(),
            role: LEDGER_ACCESS.OWNER,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          console.log(
            `User ${user.id} linked to Ledger ${ledgerResult.insertedId.toString()}`,
          );
        },
      },
    },
  },
  user: {
    additionalFields: {
      defaultLedgerId: {
        type: 'string',
        required: false,
      },
    },
  },
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
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
  },
  trustedOrigins: [process.env.CLIENT_URL || 'http://localhost:5173'],
  plugins: [passkey()],
});

export type Session = typeof auth.$Infer.Session.session;
