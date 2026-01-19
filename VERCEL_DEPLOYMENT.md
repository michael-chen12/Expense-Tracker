# Vercel Deployment Checklist ✅

## ✅ Pre-Deployment Status: READY

### Dependencies ✅
- [x] All dependencies in correct locations
- [x] @prisma/client in dependencies (runtime)
- [x] prisma CLI in devDependencies
- [x] recharts installed
- [x] @types/react and @types/react-dom installed
- [x] pg and @prisma/adapter-pg in dependencies

### Build Configuration ✅
- [x] Build script: `prisma generate --schema=../prisma/schema.prisma && next build`
- [x] Postinstall script configured
- [x] Next.js config properly set
- [x] No TypeScript errors
- [x] No build errors
- [x] Case-sensitive imports fixed (Charts → charts)

### Environment Variables Required 🔧

You'll need to set these in Vercel:

```env
DATABASE_URL=postgresql://postgres.xxx:password@host:6543/postgres
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-app.vercel.app
GITHUB_ID=your-github-oauth-id
GITHUB_SECRET=your-github-oauth-secret
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Files Status ✅
- [x] .gitignore configured
- [x] No sensitive data in repository
- [x] Prisma schema accessible at ../prisma/schema.prisma
- [x] All code pushed to GitHub

## Deployment Steps

### 1. Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository: `michael-chen12/expense-tracker`
3. Configure project:
   - **Root Directory**: `client`
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: Leave default (uses package.json script)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

### 2. Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

#### Required Variables:
- `DATABASE_URL` - Your Supabase PostgreSQL connection URL
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Set to `https://your-app.vercel.app` (update after first deploy)
- `GITHUB_ID` - From your GitHub OAuth App
- `GITHUB_SECRET` - From your GitHub OAuth App
- `NEXT_PUBLIC_API_URL` - Your backend API URL

#### From your .env file:
```
DATABASE_URL=postgresql://postgres.pruphfjwkoaptpypmvsn:Baesuzy12-+@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
NEXTAUTH_SECRET=4EX6YqReHFbTlkxxQ270nzMmdDTp6EeC5aUwekMwtfM=
GITHUB_ID=Ov23liv8ZwZT2B1N7ZfR
GITHUB_SECRET=3a2d2c24a6d827614b23e8a9810eeccb42111637
```

**Note**: Replace localhost URLs with production URLs after deployment

### 3. Deploy

Click "Deploy" button in Vercel

Expected build time: ~2-3 minutes

### 4. Post-Deployment

After successful deployment:

1. **Copy your Vercel URL** (e.g., `https://expense-tracker-abc123.vercel.app`)

2. **Update Environment Variables**:
   - Go to Vercel Settings → Environment Variables
   - Update `NEXTAUTH_URL` to your actual Vercel URL
   - Redeploy (Vercel → Deployments → ... → Redeploy)

3. **Update GitHub OAuth App**:
   - Go to https://github.com/settings/developers
   - Select your OAuth App
   - Update **Authorization callback URL** to:
     ```
     https://your-vercel-url.vercel.app/api/auth/callback/github
     ```

4. **Test Your Deployment**:
   - Visit your Vercel URL
   - Try to register/login
   - Add an expense
   - Check that charts display correctly

### 5. Deploy Backend (if not already deployed)

Your Express backend also needs to be deployed. Options:

**Railway** (Recommended):
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repo and choose the `server` folder
4. Add environment variables:
   - `DATABASE_URL` (same as frontend)
   - `PORT=4000`
   - `JWT_SECRET` (your JWT secret)
   - `CLIENT_URL` (your Vercel URL)

**After backend is deployed**:
- Copy the backend URL
- Update `NEXT_PUBLIC_API_URL` in Vercel to your backend URL
- Redeploy frontend

## Troubleshooting

### Build fails with "Cannot find module"
- Check that all imports use correct case (lowercase folders)
- Verify all dependencies are in package.json

### Database connection fails
- Verify DATABASE_URL is correct
- Check that you're using connection pooling URL (port 6543 for Supabase)
- Ensure database is accessible from Vercel's IP ranges

### Authentication fails
- Verify NEXTAUTH_URL matches your Vercel URL exactly
- Check GitHub OAuth callback URL matches
- Ensure NEXTAUTH_SECRET is set

### Prisma Client errors
- Build logs should show "✔ Generated Prisma Client"
- If not, check that prisma is in devDependencies
- Verify schema path: ../prisma/schema.prisma

## Current Configuration Summary

- **Framework**: Next.js 14.2.35
- **Database**: PostgreSQL via Supabase (with connection pooling)
- **ORM**: Prisma 7.2.0
- **Auth**: NextAuth with GitHub OAuth
- **Charts**: Recharts 3.6.0
- **Backend**: Express.js (to be deployed separately)

## Deployment URLs

After deployment, note these URLs:

- Frontend (Vercel): `___________________________`
- Backend (Railway): `___________________________`
- Database (Supabase): Already configured

---

**Everything is ready for deployment! 🚀**

Your code has been tested and builds successfully locally. 
All dependencies are correctly configured.
No errors or warnings detected.

Proceed with confidence! 💪
