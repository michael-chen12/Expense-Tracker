# Quick Start Guide

This guide will help you:
1. Fix the webpack cache issue
2. Set up GitHub OAuth
3. Test the complete application

---

## Part 1: Fix Webpack Cache Issue (5 minutes)

The frontend is showing a "Module not found: @/components/AuthGate" error. This is a webpack caching issue. Here's how to fix it:

### Option 1: Simple Cache Clear (Try this first)

```bash
# Stop the servers if running (Ctrl+C in terminal)

# Navigate to project root
cd /Users/chenqinfeng/Desktop/Projects/expense-tracker

# Clear all caches
cd client
rm -rf .next
rm -rf node_modules/.cache
cd ..

# Restart servers
npm run dev
```

### Option 2: Nuclear Option (If Option 1 doesn't work)

```bash
# Stop the servers if running (Ctrl+C in terminal)

# Navigate to client directory
cd /Users/chenqinfeng/Desktop/Projects/expense-tracker/client

# Remove all build artifacts and dependencies
rm -rf .next
rm -rf node_modules

# Reinstall dependencies
npm install

# Go back to root and restart
cd ..
npm run dev
```

### Option 3: Alternative Workaround (If both fail)

If the above don't work, there might be an issue with the jsconfig.json path aliases. You can temporarily work around it by changing the import style in ONE file to test:

```javascript
// Instead of:
import AuthGate from '@/components/AuthGate';

// Try:
import AuthGate from '../components/AuthGate';
```

But this shouldn't be necessary - Options 1 or 2 should work.

### Verify It's Fixed

Once servers restart, open your browser:
1. Go to http://localhost:3002/expenses
2. You should see the expenses page load (might show "no expenses" if database is empty)
3. No "Module not found" error

---

## Part 2: Set Up GitHub OAuth (10 minutes)

### Step 1: Create GitHub OAuth App

1. **Go to**: https://github.com/settings/developers
2. **Click**: "OAuth Apps" in the left sidebar
3. **Click**: "New OAuth App" button

### Step 2: Fill in Application Details

Use these EXACT values:

| Field | Value |
|-------|-------|
| **Application name** | `Expense Tracker (Development)` |
| **Homepage URL** | `http://localhost:3002` |
| **Authorization callback URL** | `http://localhost:3002/api/auth/callback/github` |

⚠️ **CRITICAL**: The callback URL must be EXACTLY: `http://localhost:3002/api/auth/callback/github`

### Step 3: Get Your Credentials

1. Click "Register application"
2. You'll see your **Client ID** (looks like: `Iv1.abc123def456`)
3. Click "Generate a new client secret"
4. **Copy the secret immediately** (you won't see it again!)

### Step 4: Update .env File

Open `/Users/chenqinfeng/Desktop/Projects/expense-tracker/.env` in a text editor and update these lines:

```bash
GITHUB_ID="your_client_id_here"
GITHUB_SECRET="your_client_secret_here"
```

Replace with your actual credentials (keep the quotes).

### Step 5: Restart Servers

```bash
# Stop servers (Ctrl+C)
# Restart
npm run dev
```

### Verify OAuth Works

1. Go to http://localhost:3002
2. Click "Sign in with GitHub"
3. Authorize the application
4. You should be redirected back and logged in
5. Check backend logs - you should see "Created new user:" or "Updated existing user:"

---

## Part 3: Test Complete Flow (5 minutes)

### Test 1: Create an Expense

1. Click "New expense"
2. Fill in:
   - Amount: 25.50
   - Category: Food
   - Date: Today
   - Note: Test expense
3. Click "Add expense"
4. You should be redirected to expenses list
5. **Backend check**: `curl http://localhost:4000/api/expenses` should show your expense

### Test 2: View Expenses

1. Click "Expenses" in navigation
2. You should see your test expense
3. Data is coming from PostgreSQL (not localStorage)

### Test 3: Edit Expense

1. Click "Edit" on your test expense
2. Change amount to 30.00
3. Click "Save changes"
4. Should see updated amount

### Test 4: Filter Expenses

1. On expenses page, use the filter controls
2. Try filtering by category (Food)
3. Try filtering by date range
4. Click "Apply filters"

### Test 5: View Summary

1. Click "Monthly summary" in navigation
2. Should see your expenses grouped by month
3. Click on a month to expand details

### Test 6: Delete Expense

1. Go back to "Expenses"
2. Click delete icon (trash can)
3. Confirm deletion
4. Expense should disappear

---

## Troubleshooting

### "Module not found: @/components/AuthGate"

**Cause**: Webpack cache issue
**Fix**: Run Option 1 or 2 from Part 1 above

### "Redirect URI mismatch" (GitHub OAuth)

**Cause**: Callback URL doesn't match
**Fix**:
- Check GitHub OAuth app settings
- Must be exactly: `http://localhost:3002/api/auth/callback/github`
- Frontend must be running on port 3002

### "Client authentication failed" (GitHub OAuth)

**Cause**: Wrong credentials in .env
**Fix**:
- Double-check GITHUB_ID and GITHUB_SECRET in .env
- No extra spaces or quotes around values
- Restart servers after changing .env

### "User not created in database"

**Cause**: Backend user sync failed
**Fix**:
- Check backend logs for errors
- Verify backend is running: `curl http://localhost:4000/api/health`
- Test user sync manually:
  ```bash
  curl -X POST http://localhost:4000/api/users/sync \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","name":"Test User"}'
  ```

### Frontend shows old data (localStorage)

**Cause**: Browser cached the old version
**Fix**:
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Or open DevTools → Application → Clear storage

### "EADDRINUSE: port already in use"

**Cause**: Servers still running from previous session
**Fix**:
```bash
# Kill process on port 4000 (backend)
lsof -ti:4000 | xargs kill -9

# Kill process on port 3002 (frontend)
lsof -ti:3002 | xargs kill -9

# Restart
npm run dev
```

---

## Quick Commands Reference

**Start servers**:
```bash
cd /Users/chenqinfeng/Desktop/Projects/expense-tracker
npm run dev
```

**Stop servers**:
```
Press Ctrl+C in terminal
```

**Test backend**:
```bash
curl http://localhost:4000/api/health
curl http://localhost:4000/api/expenses
```

**View frontend**:
```
Open http://localhost:3002 in browser
```

**Check backend logs**:
```
Look at terminal output where you ran `npm run dev`
Backend logs start with [1]
Frontend logs start with [0]
```

---

## What You Should See

### Successful Startup

Terminal output should show:
```
[1] Expense API running on http://localhost:4000
[0] ✓ Ready in 1791ms
```

### Browser (before login)

- Navigation: Home, Expenses, Monthly summary, Sign in
- Click "Sign in" → redirects to GitHub

### Browser (after login)

- Shows your GitHub username/email
- Can create/edit/delete expenses
- All data persists in PostgreSQL
- Fixed costs and allowance still work (via localStorage)

---

## Next Steps After Setup

1. **Explore the code** - I can walk you through each file
2. **Add more features** - Fixed costs and allowance backend endpoints
3. **Add testing** - Phase 2 (Jest, React Testing Library, Playwright)
4. **Deploy to production** - Phase 4 (Vercel + Railway)

---

## Need Help?

If you run into issues:
1. Check the logs in terminal where `npm run dev` is running
2. Check browser console (F12 → Console tab)
3. Look in the troubleshooting section above
4. Read [MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md) for detailed info

---

**Current Status**:
- ✅ Backend: Fully functional (PostgreSQL + Express)
- ⚠️ Frontend: Code complete (webpack cache issue)
- ⏳ OAuth: Waiting for credentials
- 🎯 Goal: Get everything working end-to-end!
