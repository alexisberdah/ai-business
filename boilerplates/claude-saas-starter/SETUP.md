# Setup Guide - Claude SaaS Starter

Complete step-by-step guide to get your SaaS running in production.

---

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js 18+ installed ([nodejs.org](https://nodejs.org))
- [ ] A code editor (VS Code recommended)
- [ ] Git installed
- [ ] A Supabase account (free tier works)
- [ ] An Anthropic API account
- [ ] A Vercel account (for deployment)

---

## 🚀 Local Development Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone [your-repo-url]
cd claude-saas-starter

# Install dependencies
npm install
```

### Step 2: Supabase Setup

1. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name and password
   - Select a region (choose closest to your users)
   - Wait for project to be created (~2 minutes)

2. **Get your credentials**
   - Go to Project Settings → API
   - Copy "Project URL" and "anon public" key

3. **Enable email authentication**
   - Go to Authentication → Providers
   - Enable "Email" provider
   - Configure email templates (optional)

4. **Configure site URL (important!)**
   - Go to Authentication → URL Configuration
   - Add Site URL: `http://localhost:3000` (for local dev)
   - Add Redirect URLs: `http://localhost:3000/auth/callback`

### Step 3: Anthropic API Setup

1. **Create an account**
   - Go to [console.anthropic.com](https://console.anthropic.com)
   - Sign up or log in

2. **Get API credits**
   - Add billing information
   - Purchase credits ($5 minimum for testing)
   - Or use free trial credits if available

3. **Create API key**
   - Go to API Keys section
   - Click "Create Key"
   - Copy the key (starts with `sk-ant-api03-`)
   - **Important**: Save it now, you won't see it again!

### Step 4: Environment Variables

1. **Create `.env.local` file**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Fill in your credentials**
   ```env
   # Supabase (from Step 2)
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # Anthropic (from Step 3)
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxx...

   # App URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Verify environment variables**
   ```bash
   # Check that .env.local is NOT in git
   git status

   # .env.local should be in .gitignore
   ```

### Step 5: Run the App

```bash
# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

You should see:
- ✅ Landing page loads
- ✅ Can navigate to /signup
- ✅ Can create an account
- ✅ Receive confirmation email
- ✅ Can log in
- ✅ Can access /dashboard
- ✅ Can use chat with Claude

---

## 🔧 Troubleshooting Local Setup

### Issue: "Cannot find module" errors

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Supabase auth not working

**Checklist**:
- [ ] Project URL and anon key are correct in `.env.local`
- [ ] Site URL is set to `http://localhost:3000` in Supabase
- [ ] Redirect URL includes `/auth/callback`
- [ ] Email provider is enabled
- [ ] Dev server was restarted after adding env vars

### Issue: Claude API returns "Invalid API key"

**Checklist**:
- [ ] API key starts with `sk-ant-api03-`
- [ ] No extra spaces in `.env.local`
- [ ] Key is on the same line (no line breaks)
- [ ] Dev server was restarted
- [ ] You have credits remaining in Anthropic console

### Issue: Streaming doesn't work

**Checklist**:
- [ ] Browser supports EventSource (all modern browsers do)
- [ ] Check browser console for errors
- [ ] API route is using edge runtime
- [ ] Network tab shows "text/event-stream" content type

---

## 🌐 Production Deployment (Vercel)

### Step 1: Prepare Supabase for Production

1. **Update Site URL**
   - Go to Supabase → Authentication → URL Configuration
   - Add production URL: `https://your-app.vercel.app`
   - Add redirect URL: `https://your-app.vercel.app/auth/callback`

2. **Keep both local and production URLs**
   - You can have multiple redirect URLs
   - Keep `localhost:3000` for development

### Step 2: Deploy to Vercel

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Connect to GitHub** (recommended)
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure environment variables in Vercel**
   - In Vercel dashboard, go to your project
   - Settings → Environment Variables
   - Add all variables from `.env.local`:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `ANTHROPIC_API_KEY`
     - `NEXT_PUBLIC_APP_URL` (set to your Vercel URL)

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Visit your production URL

### Step 3: Verify Production Deployment

Test checklist:
- [ ] Landing page loads
- [ ] Can sign up with email
- [ ] Receive confirmation email
- [ ] Can log in
- [ ] Chat works with Claude
- [ ] Redirects work correctly
- [ ] Dark mode toggle works

---

## 🔒 Security Checklist

Before going live:

- [ ] All environment variables are in Vercel (not committed to git)
- [ ] `.env.local` is in `.gitignore`
- [ ] No API keys in frontend code
- [ ] Supabase RLS policies enabled (optional but recommended)
- [ ] HTTPS enabled (Vercel does this automatically)
- [ ] Site URL and redirect URLs configured correctly

---

## 📊 Monitoring Setup

### Vercel Analytics (optional)

1. Go to Vercel dashboard → Analytics
2. Enable Web Analytics
3. View real-time traffic and performance

### Anthropic API Usage

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Check Usage tab
3. Set up budget alerts (recommended)

### Supabase Monitoring

1. Go to Supabase dashboard
2. Check Database usage
3. Monitor Auth metrics

---

## 🎨 Customization Guide

### Change Branding

1. **Update landing page**
   - Edit `app/page.tsx`
   - Change title, description, features

2. **Update dashboard header**
   - Edit `app/(dashboard)/layout.tsx`
   - Change logo and name

3. **Add your logo**
   - Add logo files to `public/`
   - Update `app/layout.tsx` metadata

### Customize Claude Behavior

1. **Change system prompt**
   - Edit `app/api/claude/stream/route.ts`
   - Modify the `system` parameter

2. **Adjust model settings**
   ```typescript
   const stream = await anthropic.messages.stream({
     model: 'claude-sonnet-4-20250514', // Change model
     max_tokens: 4096, // Adjust max length
     temperature: 1, // Add temperature control
     system: 'Your custom prompt',
     messages,
   })
   ```

### Add OAuth Providers

Coming in Week 2 update. Will include:
- Google OAuth
- GitHub OAuth
- Magic link authentication

---

## 📧 Email Configuration (Optional)

By default, Supabase sends emails using their SMTP server. To use your own:

1. **Get SMTP credentials**
   - Use SendGrid, Mailgun, or AWS SES
   - Get SMTP host, port, username, password

2. **Configure in Supabase**
   - Go to Project Settings → Auth
   - Enable Custom SMTP
   - Enter your SMTP details
   - Test email delivery

---

## 🆘 Getting Help

If you're stuck:

1. **Check the README.md** - Comprehensive documentation
2. **Search the code** - Inline comments explain everything
3. **Check browser console** - Look for error messages
4. **Check Vercel logs** - View server-side errors
5. **Email support** - [your-email] (24-48h response)

---

## ✅ Launch Checklist

Before announcing your SaaS:

- [ ] All features tested in production
- [ ] Environment variables configured
- [ ] Custom domain set up (optional)
- [ ] Analytics enabled
- [ ] Budget alerts configured
- [ ] Email templates customized
- [ ] Terms of Service and Privacy Policy added
- [ ] Contact/support email set up

---

**Next Steps**: Now that your app is running, start customizing it for your specific use case!

*Last updated: 2026-01-24*
