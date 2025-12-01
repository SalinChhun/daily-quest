# OAuth Setup Guide

OAuth authentication has been implemented using NextAuth.js. Follow these steps to complete the setup:

## 1. Install Dependencies

```bash
npm install next-auth
```

## 2. Set Up OAuth Providers

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy the Client ID and Client Secret

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Daily Quest
   - **Homepage URL**: `http://localhost:3000` (or your production URL)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the Client ID and generate a Client Secret

## 3. Environment Variables

Add these to your `.env.local` file:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Generate NEXTAUTH_SECRET

You can generate a secret key using:

```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

## 4. Database

The OAuth implementation automatically creates/updates user profiles in your database when users sign in. Make sure your Prisma schema is set up correctly and migrations are run.

## 5. How It Works

- Users click "Sign in with Google" or "Sign in with GitHub"
- They are redirected to the OAuth provider
- After authentication, they're redirected back to your app
- NextAuth creates/updates their profile in the database
- A session is created and stored in a JWT token

## 6. Session Management

- Sessions are managed by NextAuth.js using JWT tokens
- The session includes the user ID, email, name, and image
- Sessions are automatically refreshed

## 7. Sign Out

Users can sign out using the sign out button, which will clear their session.

## Troubleshooting

- **"Invalid credentials"**: Check that your OAuth client IDs and secrets are correct
- **"Redirect URI mismatch"**: Make sure the redirect URI in your OAuth app matches exactly (including http vs https)
- **Session not persisting**: Check that `NEXTAUTH_SECRET` is set and consistent across deployments

