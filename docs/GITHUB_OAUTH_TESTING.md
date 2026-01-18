# Testing GitHub OAuth Permission Prompt

## Why You're Not Seeing the Permission Prompt

GitHub's OAuth only shows the authorization/permission prompt on the **first time** you authorize an app. Once you've granted permission, GitHub remembers your choice and automatically authorizes future sign-ins without prompting.

This is standard OAuth behavior across all platforms (GitHub, Google, Facebook, etc.).

---

## How to See the Permission Prompt Again

### Option 1: Revoke App Access in GitHub Settings

1. Go to GitHub.com and sign in
2. Click your profile picture → **Settings**
3. In the left sidebar, click **Applications**
4. Click the **Authorized OAuth Apps** tab
5. Find your app in the list (it will be named based on your GitHub OAuth app name)
6. Click **Revoke** next to the app
7. Now try signing in again from `http://localhost:3000/login`
8. ✅ You'll see the permission prompt!

**Direct Link:** https://github.com/settings/applications

---

### Option 2: Use Incognito/Private Browser Mode

1. Open a new **Incognito/Private** browser window
2. Go to `http://localhost:3000/login`
3. Click "Sign in with GitHub"
4. Sign in with your GitHub account
5. ✅ You'll see the permission prompt!

**Note:** This works because incognito mode doesn't have your saved OAuth tokens.

---

### Option 3: Test with Different GitHub Account

1. Create a new GitHub account (or use an alt account)
2. Go to `http://localhost:3000/login`
3. Click "Sign in with GitHub"
4. Sign in with the new account
5. ✅ You'll see the permission prompt!

---

### Option 4: Force Re-Authorization (Add Prompt Parameter)

You can modify the GitHub provider to always show the consent screen:

**Update:** `/client/app/api/auth/[...nextauth]/route.ts`

```typescript
GitHubProvider({
  clientId: process.env.GITHUB_ID!,
  clientSecret: process.env.GITHUB_SECRET!,
  authorization: {
    params: {
      prompt: "consent",
      access_type: "offline",
      response_type: "code"
    }
  }
}),
```

**However:** GitHub doesn't support the `prompt=consent` parameter like Google does. The only way to force re-authorization is to revoke the app first.

---

## What the Permission Prompt Looks Like

When you see it, the GitHub permission prompt will show:

```
┌─────────────────────────────────────────┐
│  Authorize [Your App Name]              │
│                                          │
│  [Your App] by [Your GitHub Username]   │
│  wants to access your account           │
│                                          │
│  This application will be able to:       │
│  ✓ Read access to your email addresses  │
│  ✓ Read access to your profile info     │
│                                          │
│  [Authorize Application] [Cancel]        │
└─────────────────────────────────────────┘
```

---

## Current Behavior (Already Authorized)

Since you've already authorized the app:

1. Click "Sign in with GitHub" → Redirect to GitHub
2. GitHub sees you already authorized this app
3. **No prompt shown** (already trusted)
4. Immediately redirected back to your app
5. You're signed in ✅

**This is actually GOOD UX!** Users don't want to re-authorize every time they sign in.

---

## Testing Checklist

To properly test the GitHub OAuth flow with permission prompt:

- [ ] **Step 1:** Revoke app access at https://github.com/settings/applications
- [ ] **Step 2:** Clear browser cookies for `localhost:3000`
- [ ] **Step 3:** Go to `http://localhost:3000/login`
- [ ] **Step 4:** Click "Sign in with GitHub"
- [ ] **Step 5:** Sign in to GitHub (if not already)
- [ ] **Step 6:** ✅ **See the authorization prompt**
- [ ] **Step 7:** Click "Authorize [App Name]"
- [ ] **Step 8:** Verify redirect back to app
- [ ] **Step 9:** Verify you're signed in

---

## Screenshots of What You'll See

### 1. GitHub Sign-In Page (if not logged in)
```
Sign in to GitHub
Username or email
[________________]
Password
[________________]
[Sign in]
```

### 2. GitHub Authorization Prompt (First Time Only)
```
Authorize expense-tracker-client
by [your-username]

This application will be able to:
✓ Verify your GitHub identity
✓ Read your user profile information
✓ Access your email addresses

[Authorize application] [Cancel]
```

### 3. Redirect Back to Your App
```
✅ Successfully signed in!
Redirecting to home page...
```

---

## Common Questions

### Q: Why don't I see the prompt every time?
**A:** GitHub (and all OAuth providers) only show the prompt once. After authorization, they trust your app until you revoke access.

### Q: Is this a security issue?
**A:** No! This is standard OAuth behavior. The first-time prompt ensures users know what they're granting access to. Subsequent sign-ins are secure via OAuth tokens.

### Q: How do I force users to see the prompt?
**A:** You can't force it in production (and shouldn't!). The prompt only appears when:
- First authorization
- After revoked access
- Different user account
- Scope changes (requesting new permissions)

### Q: What if I want to change permissions?
**A:** If you modify the OAuth scopes in your GitHub App settings, users will see a new prompt showing the updated permissions.

---

## Recommended Testing Approach

**For Development:**
1. Use Option 1 (Revoke) or Option 2 (Incognito) to test the first-time flow
2. Test normal sign-in (no prompt) for returning user flow
3. Document both flows for your users

**For Production:**
1. The permission prompt will automatically show for all new users
2. Returning users get seamless sign-in (no prompt)
3. This is expected and desired behavior!

---

## Next Steps

1. **Test Now:** Revoke the app at https://github.com/settings/applications
2. **Try Again:** Sign in from `http://localhost:3000/login`
3. **Verify:** You'll see the GitHub authorization prompt
4. **Approve:** Click "Authorize"
5. **Success:** You'll be redirected back and signed in

---

**Last Updated:** 2026-01-18
**Status:** The permission prompt is working correctly - it just requires first-time authorization or revoked access to appear.
