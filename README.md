# Expense Tracker (Ledgerline)

A full-stack expense tracking application for managing personal finances with user authentication, data visualization, and automated recurring expense tracking.

![Node.js](https://img.shields.io/badge/Node.js-20.19.0-green)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Test Coverage](https://img.shields.io/badge/Coverage-97.56%25-brightgreen)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Features Guide](#features-guide)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Multi-User Authentication** - GitHub OAuth and email/password registration
- **Expense Management** - Add, edit, and delete expenses with categories and notes
- **Recurring Expenses** - Automate bills, subscriptions, and regular payments
- **Budget Tracking** - Set allowances with daily, weekly, or monthly cadences
- **Visual Analytics** - Interactive charts showing spending trends and category breakdowns
- **Monthly Summaries** - Detailed reports grouped by category
- **Keyboard Shortcuts** - Power user productivity features
- **Mobile Responsive** - Works seamlessly on all device sizes
- **Accessible** - WCAG 2.1 Level AA compliant
- **Tested** - 40 unit tests with 97.56% code coverage

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework with App Router |
| React 18 | UI component library |
| TypeScript | Type-safe JavaScript |
| NextAuth.js | Authentication handling |
| Recharts | Data visualization |
| CSS Modules | Scoped styling |

### Backend
| Technology | Purpose |
|------------|---------|
| Express.js | REST API server |
| TypeScript | Type-safe JavaScript |
| Prisma ORM | Database operations |
| bcrypt | Password hashing |
| node-cron | Scheduled tasks |
| JWT | API authentication |

### Database & Deployment
| Technology | Purpose |
|------------|---------|
| PostgreSQL | Primary database |
| Supabase | Database hosting |
| Vercel | Frontend hosting |
| Railway | Backend hosting |
| Docker | Local development |

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0.0 or higher (recommended: 20.19.0)
- **npm** 9.0.0 or higher
- **PostgreSQL** 15+ (or use Supabase/Docker)
- **Git** for version control

You'll also need:
- A [GitHub OAuth App](https://github.com/settings/developers) for social login
- A [Supabase](https://supabase.com) account (free tier) OR local PostgreSQL

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
```

### 2. Install Dependencies

Install all dependencies for root, client, and server:

```bash
npm run install:all
```

This runs `npm install` in:
- Root directory (concurrently)
- `/client` (Next.js frontend)
- `/server` (Express backend)

### 3. Set Up the Database

**Option A: Using Supabase (Recommended)**

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database**
3. Copy the **Connection pooling** URL (uses port 6543)

**Option B: Using Docker**

```bash
docker-compose up -d
```

This starts a PostgreSQL container with:
- **User:** `expense_user`
- **Password:** `expense_password`
- **Database:** `expense_tracker`
- **Port:** 5432

**Option C: Local PostgreSQL**

```bash
createdb expense_tracker
```

### 4. Run Database Migrations

```bash
cd prisma
npx prisma migrate deploy
npx prisma generate
```

---

## Configuration

Create a `.env` file in the **root directory** with the following variables:

```env
# ============================================
# Database Configuration
# ============================================
# For Supabase: Use the connection pooler URL (port 6543)
# For Docker/Local: postgresql://expense_user:expense_password@localhost:5432/expense_tracker
DATABASE_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@[REGION].pooler.supabase.com:6543/postgres"

# ============================================
# NextAuth Configuration
# ============================================
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# ============================================
# GitHub OAuth
# ============================================
# Create at: https://github.com/settings/developers
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# ============================================
# API Configuration
# ============================================
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

### Generating Required Secrets

**NextAuth Secret:**
```bash
openssl rand -base64 32
```

### Setting Up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in the details:
   - **Application name:** Expense Tracker
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Copy the **Client ID** and generate a **Client Secret**

---

## Running the Application

### Development Mode

Start both frontend and backend concurrently:

```bash
npm run dev
```

This runs:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:4000

### Individual Services

```bash
# Frontend only
npm run dev:client

# Backend only
npm run dev:server
```

### Production Mode

**Build and start the frontend:**
```bash
cd client
npm run build
npm start
```

**Build and start the backend:**
```bash
cd server
npm run build
npm run prod
```

---

## Project Structure

```
expense-tracker/
├── client/                     # Next.js Frontend
│   ├── app/                    # App Router pages
│   │   ├── page.js            # Dashboard (home)
│   │   ├── expenses/          # Expense management
│   │   ├── recurring/         # Recurring expenses
│   │   ├── summary/           # Monthly summary
│   │   ├── categories/        # Category management
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   └── api/auth/          # NextAuth endpoints
│   ├── components/            # Reusable UI components
│   │   ├── charts/            # Visualization (Recharts)
│   │   ├── Button/            # Button variants
│   │   ├── Card/              # Card container
│   │   ├── Modal/             # Dialog component
│   │   ├── ExpenseForm/       # Expense input form
│   │   └── ...                # 20+ components
│   ├── lib/                   # Utilities
│   │   ├── api-backend.ts     # API client
│   │   ├── format.ts          # Currency/date formatting
│   │   └── hooks/             # Custom React hooks
│   └── styles/                # Global styles
│
├── server/                     # Express.js Backend
│   ├── index.ts               # Main server & routes
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication
│   ├── lib/
│   │   └── prisma.ts          # Database client
│   └── types/                 # TypeScript definitions
│
├── prisma/                     # Database
│   ├── schema.prisma          # Data models
│   ├── migrations/            # Migration history
│   └── init.sql               # Initial setup
│
├── docker-compose.yml          # Local PostgreSQL
├── railway.json                # Railway deployment
├── nixpacks.toml              # Nixpacks config
└── package.json               # Root scripts
```

---

## Features Guide

### Managing Expenses

**Adding an Expense:**
1. Click the **"Add Expense"** button on the dashboard
2. Enter the amount, select a category, and pick the date
3. Optionally add a note for more context
4. Click **Save**

**Editing/Deleting:**
- Click on any expense to view details
- Use the **Edit** or **Delete** buttons

**Filtering:**
- Use the date range picker to filter by period
- Select a category to filter by type
- Expenses are paginated (20 per page)

### Setting Up Recurring Expenses

Perfect for bills, subscriptions, and regular payments:

1. Go to **Recurring** in the navigation
2. Click **"Add Recurring Expense"**
3. Configure:
   - **Amount** - How much it costs
   - **Category** - Food, Utilities, etc.
   - **Frequency** - Daily, Weekly, Monthly, or Yearly
   - **Start Date** - When it begins
   - **End Date** (optional) - When it stops

**How It Works:**
- A cron job runs every night at midnight
- It checks for recurring expenses due that day
- Automatically creates expense entries
- Updates the next due date

### Budget & Allowance

Set a spending budget to track your finances:

1. Go to the **Dashboard**
2. Click **"Set Allowance"**
3. Enter your budget amount
4. Choose cadence: **Daily**, **Weekly**, or **Monthly**

The dashboard shows:
- Your remaining balance
- Progress bar visualization
- Time until next reset

### Viewing Analytics

**Spending Trends:**
- 6-month area chart showing spending over time
- Helps identify patterns

**Category Breakdown:**
- Donut chart showing where your money goes
- Percentage breakdown by category

**Monthly Summary:**
- Go to **Summary** for detailed reports
- Filter by month and category

---

## API Reference

All endpoints are prefixed with `http://localhost:4000/api`

### Authentication

All protected endpoints require the `X-User-Id` header with the authenticated user's ID.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register new user |
| `/auth/login` | POST | Login with credentials |
| `/users/sync` | POST | Sync OAuth user to database |
| `/health` | GET | Health check |

**Register User:**
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword123",
    "name": "John Doe"
  }'
```

### Expenses

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/expenses` | GET | List expenses (paginated) |
| `/expenses/:id` | GET | Get single expense |
| `/expenses` | POST | Create expense |
| `/expenses/:id` | PUT | Update expense |
| `/expenses/:id` | DELETE | Delete expense |

**Query Parameters (GET /expenses):**
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 20, max: 100)
- `from` - Start date (YYYY-MM-DD)
- `to` - End date (YYYY-MM-DD)
- `category` - Filter by category

**Create Expense:**
```bash
curl -X POST http://localhost:4000/api/expenses \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user_id_here" \
  -d '{
    "amount": 25.50,
    "category": "Food",
    "date": "2026-01-25",
    "note": "Lunch at cafe"
  }'
```

**Response:**
```json
{
  "item": {
    "id": 1,
    "amount": 25.50,
    "category": "Food",
    "date": "2026-01-25",
    "note": "Lunch at cafe",
    "createdAt": "2026-01-25T12:00:00.000Z",
    "userId": "user_id_here"
  }
}
```

### Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/summary` | GET | Get spending summary |

**Query Parameters:**
- `from` - Start date (YYYY-MM-DD)
- `to` - End date (YYYY-MM-DD)
- `category` - Filter by category

**Response:**
```json
{
  "totalCents": 125000,
  "total": 1250.00,
  "byCategory": [
    { "category": "Food", "totalCents": 50000, "total": 500.00 },
    { "category": "Utilities", "totalCents": 75000, "total": 750.00 }
  ]
}
```

### Allowance

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/allowance` | GET | Get allowance settings |
| `/allowance` | PUT | Update allowance |
| `/allowance/status` | GET | Get current period status |

**Update Allowance:**
```bash
curl -X PUT http://localhost:4000/api/allowance \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user_id_here" \
  -d '{
    "amount": 500,
    "cadence": "week"
  }'
```

**Cadence Options:** `day`, `week`, `month`

### Recurring Expenses

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/recurring-expenses` | GET | List all recurring |
| `/recurring-expenses/:id` | GET | Get single recurring |
| `/recurring-expenses` | POST | Create recurring |
| `/recurring-expenses/:id` | PUT | Update recurring |
| `/recurring-expenses/:id` | DELETE | Soft delete recurring |
| `/recurring-expenses/process` | POST | Manually trigger processing |

**Create Recurring Expense:**
```bash
curl -X POST http://localhost:4000/api/recurring-expenses \
  -H "Content-Type: application/json" \
  -H "X-User-Id: user_id_here" \
  -d '{
    "amount": 9.99,
    "category": "Subscriptions",
    "note": "Netflix",
    "frequency": "monthly",
    "dayOfMonth": 15,
    "nextDate": "2026-02-15"
  }'
```

**Frequency Options:** `daily`, `weekly`, `monthly`, `yearly`

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐
│    User     │────<│   Expense   │
│─────────────│     │─────────────│
│ id (PK)     │     │ id (PK)     │
│ email       │     │ userId (FK) │
│ password    │     │ amountCents │
│ githubId    │     │ category    │
│ name        │     │ date        │
│ createdAt   │     │ note        │
│ updatedAt   │     │ createdAt   │
└─────────────┘     │ updatedAt   │
       │            └─────────────┘
       │
       │            ┌──────────────────┐
       ├───────────<│ RecurringExpense │
       │            │──────────────────│
       │            │ id (PK)          │
       │            │ userId (FK)      │
       │            │ amountCents      │
       │            │ category         │
       │            │ frequency        │
       │            │ nextDate         │
       │            │ endDate          │
       │            │ isActive         │
       │            └──────────────────┘
       │
       └───────────<┌─────────────┐
                    │  Allowance  │
                    │─────────────│
                    │ id (PK)     │
                    │ userId (FK) │
                    │ amountCents │
                    │ cadence     │
                    └─────────────┘
```

### Model Details

**User**
- Supports both OAuth (GitHub) and email/password authentication
- Password is nullable for OAuth-only users
- One allowance per user (1:1 relationship)

**Expense**
- Amounts stored in cents for precision
- Indexed on `userId + date` and `userId + category` for fast queries

**RecurringExpense**
- Supports daily, weekly, monthly, yearly frequencies
- `nextDate` tracks when the next expense should be generated
- Soft delete via `isActive` flag

**Allowance**
- Budget settings per user
- Cadence: day, week, or month

---

## Deployment

### Deploy to Vercel (Frontend)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Set the **Root Directory** to `client`
4. Add environment variables:
   ```
   DATABASE_URL=your_supabase_url
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=https://your-app.vercel.app
   GITHUB_ID=your_github_id
   GITHUB_SECRET=your_github_secret
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```
5. Deploy!

### Deploy to Railway (Backend)

1. Go to [railway.app](https://railway.app) and create a new project
2. Connect your GitHub repository
3. Railway will auto-detect the `railway.json` configuration
4. Add environment variables:
   ```
   DATABASE_URL=your_supabase_url
   NEXTAUTH_SECRET=your_secret
   PORT=4000
   ```
5. Deploy!

The `railway.json` is pre-configured:
```json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "cd server && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Deploy with Docker

For self-hosted deployments:

```bash
# Start PostgreSQL
docker-compose up -d

# Run migrations
cd prisma
npx prisma migrate deploy

# Build and run
cd client && npm run build && npm start &
cd server && npm run build && npm run prod &
```

---

## Testing

### Running Tests

```bash
# From client directory
cd client

# Watch mode (development)
npm test

# Single run (CI)
npm run test:run

# With coverage report
npm run test:coverage

# UI mode
npm run test:ui
```

### End-to-End Tests

```bash
# Run E2E tests
npm run test:e2e

# With UI
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug
```

### Test Coverage

Current coverage: **97.56%**

| Category | Coverage |
|----------|----------|
| Statements | 97.56% |
| Branches | 95.00% |
| Functions | 98.00% |
| Lines | 97.56% |

---

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 4000
lsof -ti:4000 | xargs kill -9
```

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. For Supabase, use the **connection pooler** URL (port 6543, not 5432)
3. Check that your IP is allowed in Supabase settings

### Authentication Errors

- **"Invalid token"** - Sign out and back in
- **"User not found"** - Check that user sync is working
- **Session issues** - Clear browser cookies

### Build Errors

```bash
# Clear Next.js cache
cd client
rm -rf .next node_modules/.cache
npm install

# Regenerate Prisma client
npx prisma generate
```

### Recurring Expenses Not Processing

1. Check server logs for cron job output
2. Manually trigger: `POST /api/recurring-expenses/process`
3. Verify server timezone matches expected behavior

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use TypeScript for new code
- Follow existing patterns and naming conventions
- Add tests for new features
- Ensure all tests pass before submitting

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://prisma.io/) - Database ORM
- [Supabase](https://supabase.com/) - Database hosting
- [Railway](https://railway.app/) - Backend hosting
- [Vercel](https://vercel.com/) - Frontend hosting
