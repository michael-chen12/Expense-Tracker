# Expense Tracker (Ledgerline) - Complete Documentation

**Last Updated**: 2026-01-19
**Status**: Phase 1 Complete, Phase 2 In Progress

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Quick Start Guide](#2-quick-start-guide)
3. [Architecture & Tech Stack](#3-architecture--tech-stack)
4. [Development Commands](#4-development-commands)
5. [Authentication System](#5-authentication-system)
6. [API Endpoints](#6-api-endpoints)
7. [Database Schema](#7-database-schema)
8. [Component Library](#8-component-library)
9. [Testing](#9-testing)
10. [Project Phases & Progress](#10-project-phases--progress)
11. [Environment Variables](#11-environment-variables)
12. [Troubleshooting](#12-troubleshooting)
13. [Deployment](#13-deployment)

---

## 1. Project Overview

A production-ready full-stack expense tracker built with Next.js, Express, PostgreSQL, and Prisma ORM.

### Features

**Current Features:**
- ✅ Full-stack architecture (Next.js frontend + Express backend)
- ✅ PostgreSQL database with Prisma ORM
- ✅ Multi-user support with user-scoped data
- ✅ JWT authentication
- ✅ GitHub OAuth integration via NextAuth.js
- ✅ Email/password authentication with bcrypt
- ✅ TypeScript support (server + partial client)
- ✅ Recurring expenses with automated processing
- ✅ Data visualization with charts
- ✅ Keyboard shortcuts for power users
- ✅ Accessible UI (WCAG 2.1 Level AA compliant)
- ✅ Mobile responsive design
- ✅ Component library with design system

**In Progress:**
- 🚧 Testing framework (70%+ coverage target)
- 🚧 TypeScript conversion (client-side)
- 🚧 E2E test suite with Playwright

**Planned:**
- 📋 Shared budgets for couples/roommates
- 📋 CSV/PDF export functionality
- 📋 Custom categories and tags
- 📋 CI/CD pipeline
- 📋 Production deployment

### Tech Stack Summary

- **Frontend**: Next.js 14, React 18, TypeScript, NextAuth.js
- **Backend**: Express.js, TypeScript, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Testing**: Vitest with Testing Library
- **Authentication**: JWT + NextAuth + bcrypt

---

## 2. Quick Start Guide

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (we use Supabase free tier)
- GitHub OAuth App credentials

### Installation

**1. Clone and Install Dependencies**

```bash
# Install all dependencies (root, client, server)
npm run install:all
```

**2. Environment Setup**

Create `.env` in the root directory:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT]:PASSWORD@aws-region.pooler.supabase.com:6543/postgres"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# API URL
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**3. Database Setup**

The database tables are already created in your Supabase instance.

**4. Start Development Servers**

```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000 (or 3001 if 3000 is in use)
- Backend API: http://localhost:4000

### First-Time Setup

1. Navigate to http://localhost:3000
2. Click "Sign in with GitHub" or "Register"
3. Create your account or authorize with GitHub
4. Add your first expense

---

## 3. Architecture & Tech Stack

### Project Structure

```
expense-tracker/
├── client/          # Next.js 14 frontend (App Router)
│   ├── app/         # Pages and layouts
│   │   ├── page.js              # Dashboard
│   │   ├── expenses/            # Expense pages
│   │   ├── recurring/           # Recurring expenses
│   │   ├── summary/             # Monthly summary
│   │   ├── login/               # Custom login page
│   │   ├── register/            # Registration page
│   │   └── api/auth/[...nextauth]/  # NextAuth endpoint
│   ├── components/  # React components
│   │   ├── charts/              # Data visualization
│   │   ├── recurring/           # Recurring expense components
│   │   ├── Alert/               # Alert notifications
│   │   ├── Avatar/              # User avatars
│   │   ├── Badge/               # Status badges
│   │   ├── Button/              # Button component
│   │   ├── Card/                # Card component
│   │   ├── Container/           # Layout container
│   │   ├── Divider/             # Visual divider
│   │   ├── Form/                # Form components
│   │   ├── Input/               # Input field
│   │   ├── Modal/               # Modal dialog
│   │   ├── Spinner/             # Loading spinner
│   │   ├── Stack/               # Flexbox layout
│   │   └── Tooltip/             # Tooltips
│   ├── lib/         # API client, utilities, hooks
│   │   ├── api-backend.ts       # Backend API client
│   │   ├── format.ts            # Formatting utilities
│   │   ├── chart-utils.ts       # Chart data processing
│   │   └── hooks/               # Custom React hooks
│   ├── styles/      # Global styles and design tokens
│   └── public/      # Static assets
├── server/          # Express.js backend API
│   ├── index.ts                 # Main server file
│   ├── middleware/              # JWT auth middleware
│   │   └── auth.ts
│   ├── lib/                     # Prisma client
│   │   └── prisma.ts
│   └── types/                   # TypeScript types
│       └── express.d.ts
├── prisma/          # Database schema and migrations
│   ├── schema.prisma            # 5 models (User, Expense, etc.)
│   ├── config.ts                # Prisma 7 configuration
│   └── init.sql                 # Manual table creation
└── .env             # Environment variables
```

### Frontend Architecture

- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18 with TypeScript
- **State Management**: React hooks + Context (where needed)
- **Styling**: CSS Modules + global CSS variables
- **Authentication**: NextAuth.js for GitHub OAuth and credentials
- **API Communication**: Centralized client in `api-backend.ts`
- **Charts**: Recharts for data visualization

### Backend Architecture

- **Framework**: Express.js with TypeScript
- **Database ORM**: Prisma 7 with PostgreSQL adapter
- **Authentication**: JWT token validation middleware
- **Validation**: Server-side input validation
- **Security**: bcrypt for passwords, CORS protection
- **Cron Jobs**: node-cron for recurring expense processing

### Database Architecture

- **Type**: PostgreSQL hosted on Supabase (free tier)
- **Connection**: Connection pooler (port 6543)
- **ORM**: Prisma with type-safe queries
- **Indexes**: Optimized for user-scoped queries

### Key Patterns

**Authentication Flow:**
1. NextAuth.js handles GitHub OAuth and email/password login
2. Frontend sends JWT token via `Authorization: Bearer <token>` header
3. Backend validates via `authenticateToken` middleware in `/server/middleware/auth.ts`
4. All queries scoped to authenticated user

**API Client:**
- `/client/lib/api-backend.ts` - Centralized API interface
- Session-aware authentication headers
- Type-safe request/response handling
- Error handling with user-friendly messages

**Data Model:**
- Amounts stored as integers (cents) - convert with `amountCents / 100` for display
- Dates stored as ISO strings (YYYY-MM-DD)
- User-scoped data isolation (all queries filter by userId)

**Recurring Expenses:**
- Processed via node-cron scheduler in the server
- Runs daily at midnight to generate due expenses
- Calculates next occurrence based on frequency

---

## 4. Development Commands

### Root Directory

```bash
npm run dev              # Start both client (port 3000/3001) and server (port 4000)
npm run dev:client       # Start frontend only
npm run dev:server       # Start backend only
npm run install:all      # Install dependencies for all packages
```

### Client (from /client)

```bash
npm run dev              # Next.js dev server
npm run build            # Production build
npm run start            # Start production server
npm run lint             # ESLint
npm test                 # Run tests in watch mode
npm run test:run         # Run tests once (CI mode)
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report
```

### Server (from /server)

```bash
npm run dev              # ts-node with nodemon (hot reload)
npm run build            # TypeScript compilation to /dist
npm run start            # Start production server
```

### Database (from root or /server)

```bash
npx prisma generate      # Regenerate Prisma client after schema changes
npx prisma studio        # Open Prisma Studio (database GUI)
```

---

## 5. Authentication System

The expense tracker supports two authentication methods:

### Authentication Methods

**1. Email/Password Authentication**
- User registration with name, email, password
- Secure password hashing with bcrypt (salt rounds: 10)
- Password validation (minimum 8 characters)
- Duplicate email prevention
- Auto-login after successful registration

**2. GitHub OAuth**
- One-click GitHub sign-in
- Explicit permission prompt via GitHub's OAuth consent screen
- Automatic user sync to database
- Profile information retrieval (name, email)

### User Flows

**Registration Flow (Email/Password):**

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

**Login Flow (Email/Password):**

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

**GitHub OAuth Flow:**

1. User clicks "Sign in with GitHub" button
2. Frontend calls NextAuth `signIn('github', { ... })`
3. User redirected to GitHub's OAuth consent page
4. **User explicitly grants permission**
5. GitHub redirects back to callback URL
6. NextAuth receives OAuth tokens
7. NextAuth `signIn` callback syncs user to database:
   - Checks if user exists (by email)
   - Creates new user or updates existing
   - Stores GitHub ID for account linking
8. User redirected to home page

### NextAuth Configuration

**Providers:**
1. **CredentialsProvider** - Email/password authentication
   - Validates credentials via `/api/auth/login`
   - Returns user object on success

2. **GitHubProvider** - OAuth authentication
   - Uses `GITHUB_ID` and `GITHUB_SECRET` from `.env`
   - Syncs user to database via `/api/users/sync`

**Callbacks:**

- **signIn Callback**: Syncs GitHub users to database on first sign-in
- **jwt Callback**: Adds `userId`, `email`, `name` to JWT token
- **session Callback**: Adds `userId` and `accessToken` to session for frontend

### Security Features

1. **Password Hashing** - bcrypt with 10 salt rounds
2. **No Plain Text Passwords** - Never stored or logged
3. **JWT Sessions** - Secure token-based authentication
4. **HTTPS Required** - Production uses HTTPS only
5. **Input Validation** - Server-side validation on all inputs
6. **SQL Injection Prevention** - Prisma parameterized queries
7. **CORS Protection** - Backend CORS middleware
8. **Password Requirements** - Minimum 8 characters

### API Endpoints

**POST `/api/auth/register`** - User registration

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**POST `/api/auth/login`** - Credential validation (used by NextAuth)

Request body:
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

---

## 6. API Endpoints

All endpoints support JWT authentication via `Authorization: Bearer <token>` header. User data is automatically scoped to the authenticated user.

### Health & General

**GET `/api/health`** - Health check
```bash
curl http://localhost:4000/api/health
# Response: {"status":"ok"}
```

### Expenses

**GET `/api/expenses`** - List expenses (paginated, filtered by user)
```bash
# Query parameters: page, pageSize, from, to, category
curl "http://localhost:4000/api/expenses?page=1&pageSize=20"
```

**GET `/api/expenses/:id`** - Get single expense
```bash
curl http://localhost:4000/api/expenses/1
```

**POST `/api/expenses`** - Create new expense
```bash
curl -X POST http://localhost:4000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25.50,
    "category": "Food",
    "date": "2026-01-17",
    "note": "Lunch"
  }'
```

**PUT `/api/expenses/:id`** - Update expense
```bash
curl -X PUT http://localhost:4000/api/expenses/1 \
  -H "Content-Type: application/json" \
  -d '{"amount": 30.00}'
```

**DELETE `/api/expenses/:id`** - Delete expense
```bash
curl -X DELETE http://localhost:4000/api/expenses/1
```

**GET `/api/summary`** - Get spending summary by category
```bash
curl http://localhost:4000/api/summary
# Response: {"totalCents":6849,"total":68.49,"byCategory":[...]}
```

### Recurring Expenses

**POST `/api/recurring-expenses`** - Create recurring expense
```bash
curl -X POST http://localhost:4000/api/recurring-expenses \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1200,
    "category": "Housing",
    "note": "Monthly rent",
    "frequency": "monthly",
    "dayOfMonth": 1,
    "nextDate": "2026-02-01"
  }'
```

**GET `/api/recurring-expenses`** - List all recurring expenses

**GET `/api/recurring-expenses/:id`** - Get single recurring expense

**PUT `/api/recurring-expenses/:id`** - Update recurring expense

**DELETE `/api/recurring-expenses/:id`** - Delete (soft delete) recurring expense

**POST `/api/recurring-expenses/process`** - Manually trigger processing

### Authentication

**POST `/api/auth/register`** - User registration (see Authentication System)

**POST `/api/auth/login`** - Credential validation (see Authentication System)

**POST `/api/users/sync`** - Sync GitHub OAuth user to database

---

## 7. Database Schema

```prisma
model User {
  id         String      @id @default(cuid())
  email      String      @unique
  password   String?     // Null for OAuth-only users
  githubId   String?     @unique
  name       String?
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt

  // Relations
  expenses          Expense[]
  fixedCosts        FixedCost[]
  allowance         Allowance?
  recurringExpenses RecurringExpense[]

  @@index([email])
  @@index([githubId])
}

model Expense {
  id          Int      @id @default(autoincrement())
  userId      String
  amountCents Int      // Amount stored as cents
  category    String
  date        String   // ISO date string (YYYY-MM-DD)
  note        String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, date])
  @@index([userId, category])
}

model FixedCost {
  id          Int      @id @default(autoincrement())
  userId      String
  name        String
  amountCents Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Allowance {
  id                 Int      @id @default(autoincrement())
  userId             String   @unique
  monthlyAmountCents Int
  cadence            String   @default("monthly") // 'weekly', 'biweekly', 'monthly'
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model RecurringExpense {
  id          Int      @id @default(autoincrement())
  userId      String
  amountCents Int
  category    String
  note        String?
  frequency   String   // 'daily', 'weekly', 'monthly', 'yearly'
  dayOfWeek   Int?     // For weekly (0-6)
  dayOfMonth  Int?     // For monthly (1-31)
  monthOfYear Int?     // For yearly (1-12)
  nextDate    String   // ISO date string
  endDate     String?  // Optional end date
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([userId, nextDate])
}
```

---

## 8. Component Library

The expense tracker includes a comprehensive component library with a consistent design system.

### Design Tokens

**Spacing:**
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

**Colors:**
```css
--primary: #ff7a00;       /* Primary orange */
--primary-dark: #e06b00;  /* Darker orange for hover */
--text-dark: #382e23;     /* Dark brown text */
--text-light: #6b645b;    /* Light brown text */
--background: #fff5ec;    /* Warm cream background */
--surface: #ffffff;       /* White surface */
--border: #e5dccf;        /* Light border */
--error: #d32f2f;         /* Error red */
--success: #388e3c;       /* Success green */
```

**Typography:**
```css
--font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 18px;
--font-size-xl: 24px;
```

**Shadows:**
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
```

### Core Components

**Button** (`/client/components/Button/`)
- Variants: primary, secondary, ghost, danger, success
- Sizes: small, medium, large
- States: loading, disabled
- Icons: left, right, icon-only
- Full width option

**Card** (`/client/components/Card/`)
- Compound component: Card.Header, Card.Body, Card.Footer
- Variants: default, elevated
- Padding options

**Modal** (`/client/components/Modal/`)
- Compound component: Modal.Header, Modal.Body, Modal.Footer
- Backdrop with click-to-close
- Scroll lock when open
- Focus trap
- Keyboard navigation (Escape to close)

**Form/Input** (`/client/components/Form/`, `/client/components/Input/`)
- Enhanced input with icons
- Prefix/suffix support
- Clearable option
- Error states
- Helper text

**Spinner** (`/client/components/Spinner/`)
- Loading indicator
- Sizes: small, medium, large
- Colors: primary, white, dark
- CSS animation (60fps)

### Layout Components

**Container** (`/client/components/Container/`)
- Width constraints (max-width options)
- Padding control
- Centering

**Stack** (`/client/components/Stack/`)
- Flexbox layout helper
- Vertical/horizontal orientation
- Gap spacing
- Alignment options

**Divider** (`/client/components/Divider/`)
- Visual separator
- Horizontal/vertical orientation
- Optional text/label

### Feedback Components

**Alert** (`/client/components/Alert/`)
- Compound component: Alert.Title, Alert.Description
- Variants: info, success, warning, error
- Dismissible option
- Icons included

**Badge** (`/client/components/Badge/`)
- Status indicators
- Variants: default, primary, success, warning, error
- Sizes: small, medium, large

**Tooltip** (`/client/components/Tooltip/`)
- Contextual help
- Positions: top, bottom, left, right
- Delay options
- Arrow indicator

### Data Components

**Avatar** (`/client/components/Avatar/`)
- Profile pictures
- Fallback to initials
- Sizes: small, medium, large
- Status indicator option

**SkeletonLoader** (`/client/components/SkeletonLoader/`)
- Loading placeholders
- Components: SkeletonCard, SkeletonText, SkeletonExpenseRow, SkeletonGrid
- Animated gradient
- Screen reader friendly

### Advanced Components

**LoadingButton** (`/client/components/Button/LoadingButton.js`)
- Async operation wrapper
- Automatic loading state
- Error handling
- Disabled during operation

**ErrorBoundary** (`/client/components/ErrorBoundary.tsx`)
- Catches React errors
- User-friendly error UI
- Reset functionality
- Development vs production modes

**SkipToMain** (`/client/components/SkipToMain.tsx`)
- Accessibility skip link
- Keyboard-only visible
- WCAG 2.1 Level AA compliant

### Chart Components

**SpendingTrendChart** (`/client/components/charts/SpendingTrendChart.js`)
- Area chart with gradient fill
- Last 6 months spending
- Interactive tooltips

**CategoryBreakdownChart** (`/client/components/charts/CategoryBreakdownChart.js`)
- Donut chart
- Category percentages
- Interactive legend

**BudgetProgressBar** (`/client/components/charts/BudgetProgressBar.js`)
- Animated progress indicator
- Color-coded (green/orange/red)
- Shows spent vs remaining

---

## 9. Testing

### Testing Framework

**Framework**: Vitest with Testing Library
**Coverage Target**: 70%+
**Current Coverage**: 97.56% (exceeds target by 27.56%!)

### Running Tests

```bash
# Watch mode (default)
npm test

# Run once (CI mode)
npm run test:run

# With UI
npm run test:ui

# With coverage report
npm run test:coverage

# Run single test file
npm test -- client/components/__tests__/Spinner.test.jsx
```

### Test Configuration

**Files:**
- `/client/vitest.config.js` - Vitest configuration
- `/client/vitest.setup.js` - Test setup and mocks

**Mocks Configured:**
- `next/navigation` (router, pathname, searchParams)
- `next-auth/react` (useSession, signIn, signOut)
- `next/link`
- ResizeObserver API

### Current Test Coverage

```
File                    | % Stmts | % Branch | % Funcs | % Lines
------------------------|---------|----------|---------|----------
All files               |  97.56% |   78.57% |  94.11% |  97.56%
components              |  96.87% |      80% |  93.33% |  96.87%
  ErrorBoundary.tsx     |   90.9% |   77.77% |  83.33% |   90.9%
  SkeletonLoader.tsx    |    100% |   77.77% |    100% |    100%
  SkipToMain.tsx        |    100% |     100% |    100% |    100%
  Spinner.tsx           |    100% |     100% |    100% |    100%
lib                     |    100% |      75% |    100% |    100%
  format.ts             |    100% |      75% |    100% |    100%
```

**Test Files:**
- `/client/lib/__tests__/format.test.js` - 8/8 tests passing
- `/client/components/__tests__/ErrorBoundary.test.jsx` - 6/6 tests passing
- `/client/components/__tests__/Spinner.test.jsx` - 4/4 tests passing
- `/client/components/__tests__/SkeletonLoader.test.jsx` - 13/13 tests passing
- `/client/components/__tests__/SkipToMain.test.jsx` - 6/6 tests passing

**Total**: 40 tests, 40 passing (100% pass rate)

### Manual Testing

**Authentication Testing:**

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
   - Verify permission prompt appears (first time only)
   - Approve permissions
   - Verify redirect back to app
   - Verify successful login

**API Testing:**

```bash
# Test backend health
curl http://localhost:4000/api/health

# Create expense
curl -X POST http://localhost:4000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{"amount": 25.50, "category": "Food", "date": "2026-01-17", "note": "Test"}'

# Get expenses
curl http://localhost:4000/api/expenses

# Get summary
curl http://localhost:4000/api/summary
```

### E2E Testing (Coming in Phase 2)

**Planned Tool**: Playwright

**Test Scenarios:**
- User sign-in flow
- Create/edit/delete expense
- View dashboard
- Recurring expenses workflow
- Allowance management

---

## 10. Project Phases & Progress

### Phase 1: Backend Integration & Foundation - ✅ COMPLETE

**Status**: 100% Complete
**Completion Date**: 2026-01-18

**Accomplishments:**

1. **PostgreSQL Database Integration**
   - Supabase PostgreSQL (free tier) setup
   - Connection pooler configuration (port 6543)
   - 5 data models: User, Expense, FixedCost, Allowance, RecurringExpense

2. **Prisma ORM 7 Setup**
   - Configured with PostgreSQL adapter (@prisma/adapter-pg)
   - Type-safe database queries
   - Proper indexing for performance

3. **Complete TypeScript Migration (Server)**
   - Migrated `index.js` → `index.ts`
   - Custom Express type definitions
   - JWT middleware with proper typing

4. **JWT Authentication System**
   - Authentication middleware
   - User-scoped data filtering
   - Secure userId extraction from JWT

5. **Multi-User Backend API**
   - 8 RESTful API endpoints
   - User-scoped queries on all endpoints
   - Data isolation (users can only access their own data)

6. **NextAuth Integration**
   - GitHub OAuth provider
   - Email/password credentials provider
   - JWT session strategy
   - Custom callbacks for user sync

7. **Frontend Migration**
   - Created type-safe backend API client (`api-backend.ts`)
   - Migrated all expense pages from localStorage to backend
   - Authentication headers on all requests

8. **Development Environment**
   - Single command: `npm run dev`
   - Concurrent frontend + backend execution
   - Hot reload on both servers

**Files Created/Modified**: 40+ files

### Phase 2: Testing & Type Safety - 🚧 IN PROGRESS (85%)

**Status**: 85% Complete
**Started**: 2026-01-18

**Completed:**

1. **Testing Framework Setup** ✅
   - Vitest with Testing Library
   - 70% coverage threshold configuration
   - Test mocks for Next.js and NextAuth

2. **Unit Tests** ✅
   - 40 tests created, 40 passing (100% pass rate)
   - 97.56% code coverage (exceeds 70% target!)
   - Tests for utilities and components

3. **TypeScript Conversion (Partial)** ✅
   - Converted core utilities: `format.js` → `format.ts`
   - Converted components: Spinner, SkipToMain, SkeletonLoader, ErrorBoundary
   - Strict mode enabled in tsconfig.json

**Remaining:**

1. **E2E Tests** (15%)
   - Playwright setup
   - Critical path testing
   - Authentication flow tests

2. **CI/CD Pipeline** (0%)
   - GitHub Actions workflow
   - Automated testing
   - Build verification

**Files Created**: 7 test files, 5 TypeScript conversions

### Phase 3: Advanced Features - 📋 PLANNED

**Target**: Week 3-4

**Features:**

1. **Recurring Expenses** - ✅ IMPLEMENTED
   - Database schema for RecurringExpense
   - CRUD API endpoints
   - Automated processing with node-cron
   - UI for managing recurring expenses
   - Dashboard widget for upcoming recurring

2. **Shared Budgets** - 📋 PLANNED
   - Household creation and management
   - Member invitations
   - Expense splitting
   - Settlement calculations

3. **Export/Import** - 📋 PLANNED
   - CSV export
   - PDF export with charts
   - JSON backup
   - CSV import with duplicate detection

4. **Custom Categories** - 📋 PLANNED
   - Category database table
   - Custom colors and icons
   - Category management UI
   - Usage statistics

### Phase 4: DevOps & Production Readiness - 📋 PLANNED

**Target**: Week 5-6

**Tasks:**

1. **Docker Containerization**
   - Dockerfile for frontend
   - Dockerfile for backend
   - docker-compose.yml

2. **CI/CD Pipeline**
   - GitHub Actions workflow
   - Automated testing
   - Build verification
   - Deployment automation

3. **Production Deployment**
   - Vercel for frontend (Next.js)
   - Railway or Heroku for backend
   - Supabase production database
   - Environment configuration

4. **Monitoring & Error Tracking**
   - Sentry integration
   - Performance monitoring
   - Error logging
   - Analytics

### Historical Milestones

**Recurring Expenses Implementation** (Phase 2 Extra)
- ✅ Database migration
- ✅ 7 API endpoints
- ✅ Frequency selector UI
- ✅ Auto-generation cron job
- ✅ Dashboard integration

**Polish & Improvements** (Option 3)
- ✅ Security vulnerabilities fixed (Next.js updated)
- ✅ Error boundaries added
- ✅ Accessibility improvements (WCAG 2.1 Level AA)
- ✅ Loading states with skeleton loaders
- ✅ Mobile responsiveness enhancements
- ✅ Keyboard shortcuts for power users

**Quick Wins** (Phase 1 Extra)
- ✅ Keyboard shortcuts (n, /, g+h, g+e, etc.)
- ✅ Date range presets (Last 7 Days)
- ✅ Duplicate expense feature

---

## 11. Environment Variables

### Required Variables

Create a `.env` file in the project root:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@[REGION].pooler.supabase.com:6543/postgres"

# NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth Credentials
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# API URL (Frontend to Backend communication)
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### Generating Secrets

**NEXTAUTH_SECRET** (Required):
```bash
openssl rand -base64 32
```

**DATABASE_URL** (Supabase):
1. Sign up at https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the "Connection Pooling" connection string (port 6543)
5. Replace `[YOUR-PASSWORD]` with your database password

**GitHub OAuth Credentials**:
1. Go to https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in:
   - Application name: `Expense Tracker (Development)`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the Client ID
6. Generate a new client secret and copy it

### Production Configuration

For production deployment, update these variables:

```env
# Production Frontend URL
NEXTAUTH_URL="https://your-domain.com"

# Production API URL
NEXT_PUBLIC_API_URL="https://your-api-domain.com"

# Create separate GitHub OAuth app for production
GITHUB_ID="production-client-id"
GITHUB_SECRET="production-client-secret"
```

---

## 12. Troubleshooting

### Common Issues

**Port Already in Use**

If port 3000 or 4000 is in use:
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9
```

**Database Connection Issues**

1. Verify DATABASE_URL in `.env`
2. Check Supabase project is active
3. Ensure you're using connection pooler (port 6543)

**TypeScript Errors**

The server uses `--transpile-only` flag for faster development. For type checking:
```bash
cd server && npx tsc --noEmit
```

**Module Resolution Errors**

If you see "Module not found: @/components/..." errors:
```bash
# Clear Next.js cache
cd client
rm -rf .next node_modules/.cache
npm install
cd ..
npm run dev
```

**Authentication Errors**

**"Invalid or expired token"**:
- Server has been restarted with correct NEXTAUTH_SECRET
- Try logging out and back in to get a fresh token

**"User with this email already exists"**:
- Email is already registered
- Use login instead, or use a different email

**Password too short**:
- Passwords must be at least 8 characters

**GitHub OAuth not showing permission prompt**:
- GitHub shows permission prompt on first authorization only
- To test again: Revoke app access in GitHub settings → Authorized OAuth Apps
- Or use incognito/private browsing mode

**GitHub OAuth "Redirect URI mismatch"**:
- Callback URL must be exactly: `http://localhost:3000/api/auth/callback/github`
- Check GitHub OAuth app settings
- Ensure frontend is running on correct port

**Webpack Cache Issues**

If you see module resolution errors after pulling changes:
```bash
# Stop servers (Ctrl+C)
cd client
rm -rf .next
rm -rf node_modules/.cache
cd ..
npm run dev
```

### Test Failures

**Tests not running:**
```bash
# Reinstall dependencies
cd client
rm -rf node_modules
npm install
npm test
```

**JSX parsing errors in tests:**
- Test files with JSX must use `.jsx` or `.tsx` extension
- Check vitest.config.js has correct esbuild configuration

### Performance Issues

**Slow database queries:**
- Check indexes are created (userId, date, category)
- Use Prisma Studio to inspect query performance
- Consider adding more specific indexes

**Slow frontend loading:**
- Check for large bundle sizes
- Use Next.js built-in performance tools
- Consider code splitting

---

## 13. Deployment

### Prerequisites

- Vercel account (for frontend)
- Railway or Heroku account (for backend)
- Supabase production database (or other PostgreSQL host)
- GitHub repository

### Frontend Deployment (Vercel)

**1. Connect Repository**
- Go to https://vercel.com
- Click "New Project"
- Import your GitHub repository

**2. Configure Environment Variables**
```
NEXTAUTH_SECRET=<production-secret>
NEXTAUTH_URL=https://your-domain.vercel.app
GITHUB_ID=<production-github-id>
GITHUB_SECRET=<production-github-secret>
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

**3. Build Settings**
- Framework Preset: Next.js
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `.next`

**4. Deploy**
- Click "Deploy"
- Wait for build to complete
- Test the deployed application

### Backend Deployment (Railway)

**1. Create New Project**
- Go to https://railway.app
- Click "New Project"
- Select "Deploy from GitHub repo"

**2. Configure Environment Variables**
```
DATABASE_URL=<production-database-url>
NEXTAUTH_SECRET=<same-as-frontend>
NODE_ENV=production
```

**3. Build Settings**
- Root Directory: `server`
- Build Command: `npm run build`
- Start Command: `npm start`
- Port: 4000

**4. Deploy**
- Click "Deploy"
- Copy the deployment URL
- Update NEXT_PUBLIC_API_URL in Vercel

### Database Setup (Supabase Production)

**1. Create Production Project**
- Go to https://supabase.com
- Create new project
- Note the database credentials

**2. Run Migrations**
```bash
# Update DATABASE_URL in .env to production database
cd server
npx prisma generate
# Tables already exist from init.sql
```

**3. Verify**
- Test database connection
- Check tables are created
- Verify indexes exist

### Post-Deployment

**1. Update GitHub OAuth App**
- Create separate OAuth app for production
- Homepage URL: `https://your-domain.vercel.app`
- Callback URL: `https://your-domain.vercel.app/api/auth/callback/github`

**2. Test Critical Flows**
- Sign in with GitHub
- Create/edit/delete expense
- View dashboard
- Recurring expenses

**3. Monitor**
- Check Vercel logs for frontend errors
- Check Railway logs for backend errors
- Set up error tracking (Sentry)

### CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          npm ci
          cd client && npm ci
          cd ../server && npm ci

      - name: Run tests
        run: cd client && npm run test:run

      - name: Check coverage
        run: cd client && npm run test:coverage

      - name: Type check
        run: cd server && npx tsc --noEmit

      - name: Lint
        run: cd client && npm run lint

      - name: Build
        run: |
          cd client && npm run build
          cd ../server && npm run build
```

### Backup Strategy

**Database Backups:**
- Supabase provides automatic backups
- Enable point-in-time recovery
- Export data regularly via pg_dump

**Code Backups:**
- GitHub repository (primary)
- Vercel deployment snapshots
- Railway deployment history

---

## Additional Resources

### External Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Supabase Documentation](https://supabase.com/docs)
- [Vitest Documentation](https://vitest.dev)

### Project Files

- `/prisma/schema.prisma` - Database schema
- `/server/middleware/auth.ts` - JWT authentication
- `/client/lib/api-backend.ts` - API client
- `/client/app/api/auth/[...nextauth]/route.ts` - NextAuth configuration

### Contributing

This is a portfolio project. Contributions are welcome via pull requests.

### License

MIT

---

**End of Documentation**

For questions or issues, please check the Troubleshooting section or refer to the external documentation links above.
