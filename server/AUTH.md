# Better Auth Setup

This project uses [Better Auth](https://better-auth.com) for authentication.

## Features

- ✅ Email & Password authentication
- ✅ Google OAuth
- ✅ MongoDB adapter
- ✅ Session management
- ✅ Protected routes with NestJS guards

## Environment Variables

Add the following to your `.env` file:

```bash
# Database
MONGO_URI=mongodb://localhost:27017/budget

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3001

# Optional: Better Auth secret (auto-generated if not provided)
BETTER_AUTH_SECRET=your_secret_key
```

## API Endpoints

Better Auth automatically creates the following endpoints at `/api/auth/*`:

### Sign Up (Email & Password)

```bash
POST /api/auth/sign-up/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

### Sign In (Email & Password)

```bash
POST /api/auth/sign-in/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Sign Out

```bash
POST /api/auth/sign-out
```

### Get Session

```bash
GET /api/auth/get-session
```

### OAuth (Google)

```bash
GET /api/auth/sign-in/google
# Redirects to Google OAuth consent screen
```

## Protecting Routes

Use the `AuthGuard` to protect routes:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/auth.decorator';
import { User as UserType } from '../../../lib/auth';

@Controller('api/your-endpoint')
@UseGuards(AuthGuard) // Protect entire controller
export class YourController {
  @Get('protected')
  async protectedRoute(@User() user: UserType) {
    return {
      message: 'This is protected',
      userId: user.id,
      email: user.email,
    };
  }

  @Get('public')
  async publicRoute() {
    // This route is not protected if you don't apply the guard here
    return { message: 'This is public' };
  }
}
```

## Frontend Integration

### React Example

```tsx
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
});

// Sign in
await authClient.signIn.email({
  email: 'user@example.com',
  password: 'password',
});

// Sign up
await authClient.signUp.email({
  email: 'user@example.com',
  password: 'password',
  name: 'John Doe',
});

// Get session
const session = await authClient.getSession();

// Sign out
await authClient.signOut();
```

## Testing with cURL

### Sign Up

```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "name": "Test User"
  }'
```

### Sign In

```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### Access Protected Route

```bash
curl -X GET http://localhost:3000/api/user/me \
  -b cookies.txt
```

## Database Collections

Better Auth automatically creates the following MongoDB collections:

- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth accounts (Google, etc.)
- `verification` - Email verification tokens

## Additional Configuration

You can customize the auth configuration in `src/lib/auth.ts`:

```typescript
export const auth = betterAuth({
  database: mongodbAdapter(client.db()),
  emailAndPassword: {
    enabled: true,
    // Add email verification
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    // Add more providers
    // github: { ... },
    // discord: { ... },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});
```

## Resources

- [Better Auth Documentation](https://better-auth.com)
- [Better Auth GitHub](https://github.com/better-auth/better-auth)
