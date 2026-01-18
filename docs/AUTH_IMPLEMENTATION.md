# Authentication Implementation

Complete documentation for the dual authentication system (Email/Password + GitHub OAuth).

---

## Overview

The expense-tracker now supports two authentication methods:

1. **Email/Password Authentication** - Traditional credentials-based auth
2. **GitHub OAuth** - Social authentication with explicit permission prompt

Both methods are fully integrated with NextAuth.js and use the same PostgreSQL database for user management.

---

## Features

### Email/Password Authentication
- ✅ User registration with name, email, password
- ✅ Secure password hashing with bcrypt (salt rounds: 10)
- ✅ Password validation (minimum 8 characters)
- ✅ Duplicate email prevention
- ✅ Auto-login after successful registration
- ✅ Custom login page with error handling
- ✅ Custom register page with form validation

### GitHub OAuth
- ✅ One-click GitHub sign-in
- ✅ Explicit permission prompt (GitHub's OAuth consent screen)
- ✅ Automatic user sync to database
- ✅ Profile information retrieval (name, email)

---

## Architecture

### Frontend (Next.js)
```
/client/app/
├── login/page.js          # Custom login page (email/password + GitHub)
├── register/page.js       # Custom registration page
└── api/auth/[...nextauth]/route.ts  # NextAuth configuration
```

### Backend (Express)
```
/server/
├── index.ts               # Auth endpoints (register, login)
└── add-password-column.ts # Database migration script
```

### Database (PostgreSQL)
```sql
User {
  id         String   @id @default(cuid())
  email      String   @unique
  password   String?  -- Hashed password (null for OAuth users)
  githubId   String?  @unique
  name       String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

---

## API Endpoints

### POST `/api/auth/register`
Register a new user with email and password.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "dvus4ur6w9ugp6y9l17spudo",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Response (Error):**
```json
{
  "error": "User with this email already exists"
}
```

**Validation:**
- Email and password are required
- Password must be at least 8 characters
- Email must be unique

---

### POST `/api/auth/login`
Validate user credentials (used by NextAuth CredentialsProvider).

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "dvus4ur6w9ugp6y9l17spudo",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Response (Error):**
```json
{
  "error": "Invalid email or password"
}
```

---

## NextAuth Configuration

### Providers

1. **CredentialsProvider** - Email/password authentication
   - Validates credentials via `/api/auth/login`
   - Returns user object on success
   - Throws error on invalid credentials

2. **GitHubProvider** - OAuth authentication
   - Uses `GITHUB_ID` and `GITHUB_SECRET` from `.env`
   - Syncs user to database via `/api/users/sync`
   - Stores GitHub ID for account linking

### Callbacks

**signIn Callback:**
- Syncs GitHub users to database on first sign-in
- Credentials users are already in database (via registration)

**jwt Callback:**
- Adds `userId`, `email`, `name` to JWT token
- Stores access token for OAuth users

**session Callback:**
- Adds `userId` to session for API authentication
- Makes user ID available to frontend

---

## User Flows

### Registration Flow (Email/Password)

1. User visits `/register`
2. Enters name, email, password, confirm password
3. Frontend validates:
   - All fields filled
   - Passwords match
   - Password ≥ 8 characters
4. Frontend calls `POST /api/auth/register`
5. Backend validates:
   - Email not already registered
   - Password ≥ 8 characters
6. Backend hashes password (bcrypt, 10 rounds)
7. Backend creates user in database
8. Frontend auto-signs in user via NextAuth
9. User redirected to `/` (home page)

### Login Flow (Email/Password)

1. User visits `/login`
2. Enters email and password
3. Frontend calls NextAuth `signIn('credentials', { ... })`
4. NextAuth calls CredentialsProvider's `authorize` function
5. `authorize` calls `POST /api/auth/login`
6. Backend validates credentials:
   - User exists
   - User has password (not OAuth-only)
   - Password matches hash
7. Backend returns user object
8. NextAuth creates JWT session
9. User redirected to home page

### GitHub OAuth Flow

1. User clicks "Sign in with GitHub" button
2. Frontend calls NextAuth `signIn('github', { ... })`
3. User redirected to GitHub's OAuth consent page
4. **User explicitly grants permission** ✅
5. GitHub redirects back to callback URL
6. NextAuth receives OAuth tokens
7. NextAuth `signIn` callback syncs user to database:
   - Checks if user exists (by email)
   - Creates new user or updates existing
   - Stores GitHub ID for account linking
8. User redirected to home page

---

## Database Migration

The password column was added to the User table using:

```typescript
// server/add-password-column.ts
await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "password" TEXT;`;
```

**Command:**
```bash
cd server && npx ts-node add-password-column.ts
```

**Result:**
```
✅ Password column added successfully!
```

After adding the column, regenerate Prisma client:
```bash
npx prisma generate
```

---

## Testing

### Manual Testing (Backend)

**Test Registration:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"testpassword123"}'
```

**Expected Response:**
```json
{"success":true,"user":{"id":"...","email":"test@example.com","name":"Test User"}}
```

**Test Login:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpassword123"}'
```

**Expected Response:**
```json
{"success":true,"user":{"id":"...","email":"test@example.com","name":"Test User"}}
```

### Frontend Testing

1. **Email/Password Registration:**
   - Visit `http://localhost:3000/register`
   - Fill in all fields
   - Test validation (mismatched passwords, short password)
   - Submit form
   - Verify auto-login and redirect

2. **Email/Password Login:**
   - Visit `http://localhost:3000/login`
   - Enter registered email/password
   - Verify successful login

3. **GitHub OAuth:**
   - Visit `http://localhost:3000/login`
   - Click "Sign in with GitHub"
   - Verify redirect to GitHub
   - **Verify permission prompt appears** ✅
   - Approve permissions
   - Verify redirect back to app
   - Verify successful login

---

## Security Features

1. **Password Hashing** - bcrypt with 10 salt rounds
2. **No Plain Text Passwords** - Never stored or logged
3. **JWT Sessions** - Secure token-based authentication
4. **HTTPS Required** - Production uses HTTPS only
5. **Input Validation** - Server-side validation on all inputs
6. **SQL Injection Prevention** - Prisma parameterized queries
7. **CORS Protection** - Backend CORS middleware
8. **Password Requirements** - Minimum 8 characters

---

## Environment Variables

**Required in `.env`:**

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="..."  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth
GITHUB_ID="..."
GITHUB_SECRET="..."

# API URL (optional, defaults to http://localhost:4000)
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

---

## Files Modified/Created

### New Files
- `/client/app/login/page.js` - Custom login page
- `/client/app/register/page.js` - Custom registration page
- `/server/add-password-column.ts` - Database migration script
- `/client/next.config.js` - Webpack alias configuration

### Modified Files
- `/server/index.ts` - Added auth endpoints (register, login)
- `/client/app/api/auth/[...nextauth]/route.ts` - Added CredentialsProvider
- `/prisma/schema.prisma` - Added password field to User model
- `/.env` - Updated NEXTAUTH_URL to port 3000

---

## Troubleshooting

### Issue: "Module not found: @/components/AuthGate"
**Solution:** Create `next.config.js` with webpack alias:
```javascript
module.exports = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};
```

### Issue: TypeScript error "Property 'password' does not exist"
**Solution:**
1. Add password column to database
2. Run `npx prisma generate` to update types

### Issue: "User with this email already exists"
**Solution:** Email is already registered. Use login instead, or use different email.

### Issue: GitHub OAuth not showing permission prompt
**Solution:**
- GitHub shows permission prompt on first authorization only
- To test again: Revoke app access in GitHub settings → Authorized OAuth Apps
- Or use incognito/private browsing mode

---

## Next Steps

1. ✅ Custom login/register UI - **COMPLETE**
2. ✅ Email/password authentication - **COMPLETE**
3. ✅ GitHub OAuth integration - **COMPLETE**
4. ⏳ Add password reset functionality
5. ⏳ Add email verification
6. ⏳ Add account linking (link GitHub to existing email account)
7. ⏳ Add "Remember me" functionality
8. ⏳ Add rate limiting on auth endpoints

---

## Success Criteria

- ✅ Users can register with email/password
- ✅ Users can login with email/password
- ✅ Users can login with GitHub OAuth
- ✅ GitHub OAuth shows explicit permission prompt
- ✅ Passwords are securely hashed
- ✅ User data stored in PostgreSQL
- ✅ Both auth methods use same user table
- ✅ Custom UI for login/register
- ✅ Auto-login after registration
- ✅ Error handling and validation
- ✅ Backend endpoints tested successfully

---

**Implementation Date:** 2026-01-18
**Status:** ✅ **COMPLETE**
**Test Results:** All authentication flows working as expected
