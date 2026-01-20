# Server Deployment Guide - Railway

## Prerequisites

Before deploying, ensure you have:
- GitHub repository with your code pushed
- Railway account (sign up at https://railway.app)
- Database URL (Supabase or another PostgreSQL provider)
- NEXTAUTH_SECRET (same as used in your client deployment)

## Required Environment Variables

Your server requires the following environment variables:

### Essential Variables:
```env
DATABASE_URL=postgresql://user:password@host:port/database
NEXTAUTH_SECRET=your-nextauth-secret-from-vercel
PORT=4000
```

### Optional Variables:
```env
NODE_ENV=production
```

**IMPORTANT**: Use the SAME `NEXTAUTH_SECRET` value as your Vercel client deployment for authentication to work correctly.

## Deployment Steps

### 1. Prepare Dependencies

The server needs Prisma dependencies moved to `dependencies` (not `devDependencies`) for production:

1. Edit `server/package.json`
2. Move these packages from `devDependencies` to `dependencies`:
   - `@prisma/client` (if not already there)
   - `@prisma/adapter-pg`
   - `pg`
   - `dotenv`
   - `jsonwebtoken`

3. Keep `prisma` CLI in `devDependencies` (Railway will have access during build)

### 2. Create Railway Project

1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select your repository: `michael-chen12/expense-tracker`
4. Railway will auto-detect your project

### 3. Configure Build Settings

Railway should auto-detect Node.js, but verify:

- **Root Directory**: `/server` (or leave blank and Railway will auto-detect)
- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `npm start`
- **Install Command**: `npm install`

If Railway doesn't auto-detect the server directory:
1. Go to Settings
2. Set "Root Directory" to `server`

### 4. Add Environment Variables

In Railway Dashboard → Variables tab:

```env
DATABASE_URL=postgresql://postgres.pruphfjwkoaptpypmvsn:Baesuzy12-+@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
NEXTAUTH_SECRET=4EX6YqReHFbTlkxxQ270nzMmdDTp6EeC5aUwekMwtfM=
PORT=4000
NODE_ENV=production
```

**CRITICAL**:
- The `DATABASE_URL` should use your Supabase pooler URL (port 6543)
- The `NEXTAUTH_SECRET` must match what you set in Vercel exactly

### 5. Deploy

1. Click "Deploy" or Railway will auto-deploy after adding variables
2. Wait for build to complete (~2-3 minutes)
3. Railway will provide you with a public URL

### 6. Update Client Environment Variables

After deployment:

1. Copy your Railway URL (e.g., `https://your-app.up.railway.app`)
2. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
3. Update `NEXT_PUBLIC_API_URL` to your Railway URL
4. Redeploy your Vercel client

### 7. Test Your Deployment

Test these endpoints:

```bash
# Health check
curl https://your-railway-url.up.railway.app/api/health

# Should return: {"status":"ok"}
```

Then test from your Vercel frontend:
- Try logging in
- Add an expense
- Verify data is saved to database

## Alternative: Render Deployment

If you prefer Render over Railway:

### Render Setup:

1. Go to https://render.com/
2. New → Web Service
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `npm start`
   - **Environment**: Node
   - **Plan**: Free (or paid)

5. Add Environment Variables (same as above)

## Troubleshooting

### Build Fails with "Cannot find module '@prisma/client'"
- Ensure `@prisma/client` is in `dependencies`, not `devDependencies`
- Verify build command includes `npx prisma generate`

### Database Connection Errors
- Use the connection pooling URL (port 6543 for Supabase)
- Verify DATABASE_URL is correctly formatted
- Check that your database allows connections from Railway/Render IPs

### Authentication Fails
- Verify NEXTAUTH_SECRET matches exactly between client and server
- Check that client's NEXT_PUBLIC_API_URL points to your Railway URL
- Ensure CORS is enabled (already configured in server code)

### Port Issues
- Railway automatically assigns PORT via environment variable
- Your code already handles this: `const PORT = process.env.PORT || 4000`
- Don't hardcode the port number

## Security Checklist

- [ ] .env files are in .gitignore (already configured)
- [ ] No secrets committed to GitHub
- [ ] NEXTAUTH_SECRET is secure (generated with `openssl rand -base64 32`)
- [ ] DATABASE_URL uses connection pooling
- [ ] Environment variables set in Railway dashboard (not in code)

## Current Configuration

Based on your existing setup:

- **Database**: Supabase PostgreSQL with connection pooling
- **Auth**: JWT using NEXTAUTH_SECRET
- **Framework**: Express.js with TypeScript
- **ORM**: Prisma 7.2.0

## Deployment URLs

After deployment, record these:

- Server (Railway): `___________________________`
- Client (Vercel): `___________________________`
- Database (Supabase): Already configured

---

**Ready to deploy!**

Your server code is configured and ready for deployment.
The .env.example has been updated with all required variables.
Your secrets are protected by .gitignore.

Deploy with confidence! 🚀
