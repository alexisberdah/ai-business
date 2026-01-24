# OAuth Setup Guide

Complete guide to setting up Google and GitHub OAuth authentication.

## Overview

OAuth providers allow users to sign in with their existing Google or GitHub accounts, eliminating the need to remember another password.

## Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Create a new project (or select existing)
3. Enable "Google+ API"

### 2. Configure OAuth Consent Screen

1. Navigate to "APIs & Services" → "OAuth consent screen"
2. Select "External" user type
3. Fill in required fields:
   - App name: "Claude SaaS Starter"
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com
4. Add scopes:
   - `userinfo.email`
   - `userinfo.profile`
5. Add test users (for testing phase)
6. Submit for verification (for production)

### 3. Create OAuth Client ID

1. Navigate to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: "Claude SaaS Starter"
5. Authorized redirect URIs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
   - Supabase: `https://your-project.supabase.co/auth/v1/callback`
6. Click "Create"
7. Copy Client ID and Client Secret

### 4. Configure in Supabase

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Google"
3. Paste:
   - Client ID (from Google Cloud Console)
   - Client Secret (from Google Cloud Console)
4. Save

### 5. Test

1. Navigate to `/login`
2. Click "Continue with Google"
3. Sign in with Google account
4. Should redirect to `/dashboard`

---

## GitHub OAuth Setup

### 1. Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in details:
   - Application name: "Claude SaaS Starter"
   - Homepage URL: `https://yourdomain.com` (or `http://localhost:3000` for dev)
   - Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
4. Click "Register application"
5. Copy Client ID
6. Click "Generate a new client secret"
7. Copy Client Secret

### 2. Configure in Supabase

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "GitHub"
3. Paste:
   - Client ID (from GitHub OAuth App)
   - Client Secret (from GitHub OAuth App)
4. Save

### 3. Test

1. Navigate to `/login`
2. Click "Continue with GitHub"
3. Sign in with GitHub account
4. Should redirect to `/dashboard`

---

## Environment Variables

No additional environment variables needed! OAuth is configured entirely through Supabase Dashboard.

---

## Callback URL Structure

**Important**: The callback URL must match exactly:

```
https://your-project.supabase.co/auth/v1/callback
```

Get your Supabase project URL from:
- Supabase Dashboard → Project Settings → API

---

## Common Issues

### "Redirect URI mismatch" error

**Problem**: The callback URL in Google/GitHub doesn't match Supabase.

**Solution**:
1. Go to Google Cloud Console or GitHub OAuth App settings
2. Add the exact Supabase callback URL: `https://your-project.supabase.co/auth/v1/callback`
3. Save and try again

### User signs in but no profile data

**Problem**: Scopes not configured correctly.

**Solution**:
- Google: Ensure `userinfo.email` and `userinfo.profile` scopes are enabled
- GitHub: Ensure "user:email" scope is requested (default)

### "Unauthorized client" error (Google)

**Problem**: OAuth consent screen not published.

**Solution**:
1. Go to OAuth consent screen
2. Click "Publish App"
3. For testing, add test users instead of publishing

### Email not returned by provider

**Problem**: User hasn't granted email permission.

**Solution**:
- Ensure scopes request email access
- User must approve email sharing during OAuth flow

---

## Production Checklist

### Google

- [ ] OAuth consent screen published (or test users added)
- [ ] Production redirect URI added: `https://yourdomain.com/auth/callback`
- [ ] Supabase callback URL added: `https://your-project.supabase.co/auth/v1/callback`
- [ ] App verification completed (if needed)
- [ ] Privacy policy URL added (if required)

### GitHub

- [ ] Production homepage URL set
- [ ] Production callback URL set
- [ ] Application logo uploaded (optional)
- [ ] Application description added

### Supabase

- [ ] Google provider enabled with production credentials
- [ ] GitHub provider enabled with production credentials
- [ ] Test OAuth flow in production environment
- [ ] Confirm user creation in database

---

## Security Notes

1. **Never commit OAuth secrets**: Keep Client IDs and Secrets in Supabase Dashboard only
2. **Use HTTPS in production**: OAuth requires secure connections
3. **Restrict redirect URIs**: Only add URIs you control
4. **Rotate secrets regularly**: Change Client Secrets periodically (every 6-12 months)
5. **Monitor OAuth usage**: Check Google/GitHub analytics for suspicious activity

---

## Advanced: Custom Scopes

If you need additional user data:

### Google Scopes

Available scopes: https://developers.google.com/identity/protocols/oauth2/scopes

Example: Request user's Google Calendar access:
```typescript
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    scopes: 'https://www.googleapis.com/auth/calendar.readonly',
  },
})
```

### GitHub Scopes

Available scopes: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps

Example: Request user's repositories:
```typescript
await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    scopes: 'repo user:email',
  },
})
```

---

## Support

- Google OAuth Docs: https://developers.google.com/identity/protocols/oauth2
- GitHub OAuth Docs: https://docs.github.com/en/apps/oauth-apps
- Supabase Auth Docs: https://supabase.com/docs/guides/auth/social-login
