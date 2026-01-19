# Deployment Guide

## ✅ Pre-Deployment Checklist

### Issues Fixed:
- ✅ Case-sensitive imports (Charts → charts)
- ✅ recharts dependency moved to client/package.json
- ✅ All imports verified

## Required Environment Variables

### For Vercel (Next.js Frontend):
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-app.vercel.app
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### For Backend (Railway/Render):
```
DATABASE_URL=postgresql://...
PORT=4000
JWT_SECRET=your-jwt-secret
CLIENT_URL=https://your-app.vercel.app
```

## Deployment Steps

### Option 1: Vercel + Railway (Recommended)

#### Deploy Frontend to Vercel:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Import your repository
   - Configure:
     - Root Directory: `client`
     - Framework Preset: Next.js
     - Build Command: `npm run build`
     - Output Directory: `.next`
   
3. **Add Environment Variables** in Vercel Dashboard:
   - DATABASE_URL (from Supabase or Railway)
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL (your Vercel URL)
   - GITHUB_ID
   - GITHUB_SECRET
   - NEXT_PUBLIC_API_URL (your backend URL)

4. **Deploy**

#### Deploy Backend to Railway:

1. Go to https://railway.app
2. Create new project
3. Deploy from GitHub (server folder)
4. Add PostgreSQL database if needed
5. Set environment variables:
   - DATABASE_URL
   - JWT_SECRET
   - CLIENT_URL (your Vercel URL)

### Option 2: Single Platform (Render)

1. **Deploy PostgreSQL Database**
   - Create PostgreSQL instance on Render
   - Copy DATABASE_URL

2. **Deploy Backend**
   - Create Web Service from `server` folder
   - Set environment variables
   - Copy service URL

3. **Deploy Frontend**
   - Create Static Site from `client` folder
   - Build Command: `npm run build`
   - Publish Directory: `.next`
   - Add all environment variables

## Post-Deployment Steps

1. **Update GitHub OAuth App**
   - Go to GitHub Developer Settings
   - Update callback URL to:
     ```
     https://your-app.vercel.app/api/auth/callback/github
     ```

2. **Test the Application**
   - Register a new user
   - Test login
   - Add expenses
   - Verify charts display

3. **Monitor for Errors**
   - Check Vercel logs
   - Check Railway/Render logs

## Common Issues

### Build Fails with Module Not Found
- ✅ Fixed: Case-sensitive imports corrected
- ✅ Fixed: recharts added to client dependencies

### API Calls Fail
- Verify NEXT_PUBLIC_API_URL is set correctly
- Check CORS settings on backend
- Ensure backend is deployed and running

### Authentication Issues
- Verify NEXTAUTH_URL matches deployment URL
- Check GitHub OAuth callback URL
- Ensure NEXTAUTH_SECRET is set

### Database Connection Issues
- Verify DATABASE_URL format
- Check database is accessible from deployment platform
- For Supabase: use connection pooling URL (port 6543)

## Current Setup

- **Frontend**: Next.js 14 (React 18)
- **Backend**: Express.js
- **Database**: PostgreSQL (Supabase)
- **Auth**: NextAuth with GitHub OAuth
- **Charts**: Recharts

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [NextAuth Deployment](https://next-auth.js.org/deployment)
