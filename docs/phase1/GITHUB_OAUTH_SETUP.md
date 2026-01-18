# GitHub OAuth Setup Guide

Follow these steps to configure GitHub OAuth for your expense-tracker application.

## Step 1: Create a GitHub OAuth App

1. Go to GitHub Settings: https://github.com/settings/developers
2. Click "OAuth Apps" in the left sidebar
3. Click "New OAuth App" button

## Step 2: Fill in Application Details

**Application name**: `Expense Tracker (Development)`

**Homepage URL**: `http://localhost:3002`

**Application description** (optional): `Personal expense tracking application with PostgreSQL backend`

**Authorization callback URL**: `http://localhost:3002/api/auth/callback/github`

⚠️ **IMPORTANT**: The callback URL must be exactly: `http://localhost:3002/api/auth/callback/github`

## Step 3: Create the Application

1. Click "Register application"
2. You'll be redirected to your new OAuth app's page

## Step 4: Get Your Credentials

On your OAuth app page, you'll see:

1. **Client ID** - This is visible immediately (looks like: `Iv1.abc123def456`)
2. **Client secrets** - Click "Generate a new client secret"
   - Copy the secret immediately (you won't be able to see it again!)

## Step 5: Update Your .env File

Add these values to your `.env` file in the expense-tracker root directory:

```bash
# GitHub OAuth (for NextAuth)
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
```

Replace `your_client_id_here` and `your_client_secret_here` with your actual credentials.

## Step 6: Restart Your Servers

After updating `.env`, restart your development servers:

```bash
# Stop the current servers (Ctrl+C)
# Then restart
npm run dev
```

## Step 7: Test GitHub Authentication

1. Open http://localhost:3002
2. Click "Sign in with GitHub"
3. Authorize the application
4. You should be redirected back and logged in

## Troubleshooting

### Error: "Redirect URI mismatch"
- Make sure the callback URL in GitHub is exactly: `http://localhost:3002/api/auth/callback/github`
- Check that your frontend is running on port 3002

### Error: "Client authentication failed"
- Verify GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are correct in .env
- Make sure there are no extra spaces or quotes around the values
- Restart the servers after changing .env

### User not created in database
- Check backend logs for errors
- Verify the backend server is running on port 4000
- Test the user sync endpoint:
  ```bash
  curl -X POST http://localhost:4000/api/users/sync \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","name":"Test User"}'
  ```

## Security Notes

- Never commit your `.env` file to Git
- For production, create a separate OAuth app with production URLs
- Use environment variables in your deployment platform (Vercel, Railway, etc.)

## Production Setup (Later)

When deploying to production, create a new GitHub OAuth App with:

**Homepage URL**: `https://your-domain.com`
**Authorization callback URL**: `https://your-domain.com/api/auth/callback/github`

Then set the production environment variables in your hosting platform.

---

## Current Configuration

**Development URLs**:
- Frontend: http://localhost:3002
- Backend API: http://localhost:4000
- GitHub Callback: http://localhost:3002/api/auth/callback/github

**Environment Variables Needed**:
```
GITHUB_CLIENT_ID=     (⚠️  Not Set)
GITHUB_CLIENT_SECRET= (⚠️  Not Set)
```

Once you've completed these steps, GitHub OAuth will be fully functional!
