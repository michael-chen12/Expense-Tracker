# Testing Recurring Expenses Authentication

## What I Fixed

1. **Backend JWT Secret Mismatch**
   - Updated [server/middleware/auth.ts](server/middleware/auth.ts:5) to use `NEXTAUTH_SECRET` (same as frontend)
   - This ensures JWT tokens from NextAuth can be verified by the backend

2. **Added Debug Logging**
   - Frontend: [client/lib/api-backend.ts](client/lib/api-backend.ts:42-80) now logs session and headers
   - Backend: [server/middleware/auth.ts](server/middleware/auth.ts:44-80) now logs authentication attempts

## How to Test

1. **Open Browser Console** (F12 or Cmd+Option+I)
2. **Navigate to** http://localhost:3000/recurring
3. **Check the console logs** - you should see:
   ```
   [API] Session: { user: {...}, userId: "...", accessToken: "..." }
   [API] Using session.userId: xxx
   [API] Added Authorization header
   [API] Final headers: { ... }
   ```

4. **Check Server Logs** in the terminal running the server:
   ```
   [optionalAuth] X-User-Id header: xxx
   [optionalAuth] Set userId from header: xxx
   ```

## Common Issues and Solutions

### Issue 1: "Authentication required" error
**Cause:** No userId or accessToken in session

**Solution:**
- Make sure you're logged in
- Check browser console for session data
- Try logging out and back in

### Issue 2: "Invalid or expired token" error
**Cause:** JWT signature mismatch or expired token

**Solution:**
- Server has been restarted with correct NEXTAUTH_SECRET
- Try logging out and back in to get a fresh token

### Issue 3: No user ID in session
**Cause:** NextAuth session callback not working

**Check:**
1. Browser console shows `[API] Session: {}`
2. Navigate to http://localhost:3000/api/auth/session
3. Should see: `{ "user": {...}, "userId": "...", "accessToken": "..." }`

## Next Steps

1. **Restart both servers** to apply changes:
   ```bash
   # Kill existing processes
   pkill -f "npm run dev"

   # Start server
   cd server && npm run dev &

   # Start client
   cd client && npm run dev &
   ```

2. **Login** to your app
3. **Navigate** to /recurring page
4. **Try creating** a recurring expense
5. **Check logs** in both browser console and server terminal

## If Still Not Working

Share the console output from:
1. Browser console (when loading /recurring page)
2. Server terminal (when making the API request)
