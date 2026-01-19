# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# From root directory
npm run dev              # Start both client (port 3000/3001) and server (port 4000)
npm run dev:client       # Start frontend only
npm run dev:server       # Start backend only
npm run install:all      # Install dependencies for all packages

# Client (from /client)
npm run dev              # Next.js dev server
npm run build            # Production build
npm run lint             # ESLint
npm test                 # Run tests in watch mode
npm run test:run         # Run tests once (CI mode)
npm run test:coverage    # Generate coverage report

# Server (from /server)
npm run dev              # ts-node with nodemon (hot reload)
npm run build            # TypeScript compilation to /dist
npx ts-node test-db.ts   # Test database connection
```

## Architecture

This is a full-stack expense tracker with separate client and server packages:

```
expense-tracker/
├── client/          # Next.js 14 frontend (App Router)
│   ├── app/         # Pages and layouts
│   ├── components/  # React components
│   └── lib/         # API client (api-backend.ts), utilities, hooks
├── server/          # Express.js backend
│   ├── middleware/  # JWT auth (auth.ts)
│   └── lib/         # Prisma client
└── prisma/          # Database schema
```

**Tech Stack:**
- Frontend: Next.js 14, React 18, NextAuth.js, TypeScript
- Backend: Express.js, TypeScript, Prisma ORM
- Database: PostgreSQL (Supabase)
- Testing: Vitest with Testing Library

## Key Patterns

**Authentication Flow:**
1. NextAuth.js handles GitHub OAuth and email/password login
2. Frontend sends user ID via `X-User-Id` header
3. Backend validates via `authenticateToken` middleware in `/server/middleware/auth.ts`
4. All queries scoped to authenticated user

**API Client:** `/client/lib/api-backend.ts` - Centralized API interface with session-aware auth headers

**Data Model:** Amounts stored as integers (cents) - convert with `amountCents / 100` for display

**Recurring Expenses:** Processed via node-cron scheduler in the server

## Testing

Tests use Vitest with jsdom environment. Test files in `__tests__/` directories.

```bash
# Run single test file
npm test -- client/components/__tests__/Spinner.test.jsx

# Coverage threshold is 70%
```

Mocks configured in `/client/vitest.setup.js` for:
- `next/navigation` (router, pathname, searchParams)
- `next-auth/react` (useSession, signIn, signOut)
- `next/link`

## Environment Variables

Required in `.env` at project root:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - JWT secret (shared with backend)
- `NEXTAUTH_URL` - Frontend URL (http://localhost:3000 for dev)
- `GITHUB_ID` / `GITHUB_SECRET` - GitHub OAuth credentials
