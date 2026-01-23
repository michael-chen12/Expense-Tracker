# Expense Tracker (Ledgerline)

A full-stack expense tracking application I built to help people manage their personal finances. This started as a learning project and evolved into a production-ready app with user authentication, data visualization, and automated expense tracking.

## What This Project Does

This is a web application where you can track your daily expenses, set up recurring bills, visualize spending patterns with charts, and manage your budget. It supports multiple users with separate accounts, so everyone's data stays private and secure.

The app handles the common pain points of expense tracking: you can quickly add expenses with just a few clicks, set up recurring bills that auto-generate (like rent or subscriptions), filter and search through your spending history, and see visual breakdowns of where your money goes each month.

## Tech Stack

**Frontend:**
- Next.js 14 with App Router
- React 18
- TypeScript
- NextAuth.js for authentication
- Recharts for data visualization
- CSS Modules for styling

**Backend:**
- Express.js with TypeScript
- Prisma ORM for database operations
- JWT for API authentication
- bcrypt for password hashing
- node-cron for scheduled tasks

**Database:**
- PostgreSQL hosted on Supabase
- Five main tables: Users, Expenses, Fixed Costs, Allowances, Recurring Expenses

**Testing & Tools:**
- Vitest with React Testing Library
- 40 unit tests with 97.56% coverage
- ESLint for code quality

**Deployment:**
- Frontend on Vercel
- Backend on Railway
- Database on Supabase

## Project Structure

The project is organized as a monorepo with separate frontend and backend:

```
expense-tracker/
├── client/              # Next.js frontend
│   ├── app/            # Pages using App Router
│   │   ├── page.js              # Dashboard (home)
│   │   ├── expenses/            # Expense management pages
│   │   ├── recurring/           # Recurring expenses
│   │   ├── summary/             # Monthly summary
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   └── api/auth/            # NextAuth endpoints
│   ├── components/     # Reusable React components
│   │   ├── charts/              # Visualization components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── ...                  # 15+ UI components
│   ├── lib/            # Utilities and API client
│   │   ├── api-backend.ts       # Centralized API calls
│   │   ├── format.ts            # Currency/date formatting
│   │   └── hooks/               # Custom React hooks
│   └── styles/         # Global styles and design tokens
│
├── server/             # Express.js backend
│   ├── index.ts                 # Main server file
│   ├── middleware/
│   │   └── auth.ts              # JWT authentication
│   └── lib/
│       └── prisma.ts            # Database client
│
└── prisma/             # Database schema and config
    └── schema.prisma            # Data models
```

## How It Works

**User Flow:**
1. User signs up with email/password or logs in with GitHub OAuth
2. NextAuth creates a session and stores user info
3. Frontend sends authenticated requests to the backend API
4. Backend validates JWT tokens and returns user-specific data
5. All database queries automatically filter by the logged-in user

**Authentication Flow:**
- NextAuth handles session management on the frontend
- Backend uses JWT middleware to verify requests
- Passwords are hashed with bcrypt before storage
- GitHub OAuth syncs user data to our database

**Data Flow:**
- Frontend components fetch data using the centralized API client (`api-backend.ts`)
- API client attaches authentication headers automatically
- Express backend validates tokens and queries Prisma
- Prisma returns type-safe data from PostgreSQL
- Results are sent back to frontend and rendered

**Recurring Expenses:**
- Users set up recurring bills with frequency (daily, weekly, monthly, yearly)
- A cron job runs every night at midnight
- The job checks for any recurring expenses due that day
- It automatically creates new expense entries
- Users see these auto-generated expenses in their list

## Current Features

- Multi-user authentication with GitHub OAuth and email/password
- Add, edit, and delete expenses with categories and notes
- Recurring expense automation (bills, subscriptions, etc.)
- Visual spending analytics with interactive charts
- Monthly summary and category breakdowns
- Keyboard shortcuts for power users
- Mobile-responsive design
- Accessible UI following WCAG 2.1 Level AA standards
- 40 unit tests with 97.56% code coverage
- Production deployment on Vercel and Railway

## Quick Start

### What You'll Need

- Node.js 18 or newer
- A PostgreSQL database (I'm using Supabase's free tier)
- GitHub OAuth app credentials for social login

### Setting Up Locally

**Step 1: Install Everything**

```bash
npm run install:all
```

This installs dependencies for the root project, frontend (client), and backend (server).

**Step 2: Configure Environment**

Create a `.env` file in the root directory with these variables:

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

**Generate your NextAuth secret:**
```bash
openssl rand -base64 32
```

**Step 3: Start the Development Servers**

```bash
npm run dev
```

This starts both the frontend (port 3000) and backend API (port 4000) concurrently.

**Step 4: Use the App**

1. Open http://localhost:3000 in your browser
2. Sign in with GitHub or create an account with email/password
3. Start tracking your expenses

## Development Guide

### Available Commands

```bash
npm run dev              # Start both client (port 3000/3001) and server (port 4000)
npm run dev:client       # Start frontend only
npm run dev:server       # Start backend only
npm run install:all      # Install dependencies for all packages
```

### Client (from /client)

**Frontend commands (from /client):**

```bash
npm run dev              # Development server
npm run build            # Production build
npm test                 # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

**Backend commands (from /server):**

```bash
npm run dev              # Development with hot reload
npm run build            # Compile TypeScript
npm run start            # Production server
```

**Database commands:**

```bash
npx prisma generate      # Update Prisma client
npx prisma studio        # Open database GUI
```

## API Reference

The backend exposes a RESTful API at `http://localhost:4000/api`. All endpoints require authentication via JWT token in the Authorization header.

### Expense Endpoints

### Expense Endpoints

**GET /api/expenses** - Get all expenses (with pagination and filters)

**POST /api/expenses** - Create a new expense
```json
{
  "amount": 25.50,
  "category": "Food",
  "date": "2026-01-17",
  "note": "Lunch"
}
```

**PUT /api/expenses/:id** - Update an expense

**DELETE /api/expenses/:id** - Delete an expense

**GET /api/summary** - Get spending summary grouped by category

### Recurring Expense Endpoints

**GET /api/recurring-expenses** - List all recurring expenses

**POST /api/recurring-expenses** - Create a recurring expense

**PUT /api/recurring-expenses/:id** - Update a recurring expense

**DELETE /api/recurring-expenses/:id** - Soft delete a recurring expense

## Database Schema

The app uses five main database tables:

## Database Schema

The app uses five main database tables:

**Users** - Account information
- Stores email, password hash, GitHub ID, and profile info
- Supports both OAuth and email/password authentication

**Expenses** - Individual expense records
- Tracks amount (in cents), category, date, and optional notes
- Each expense belongs to one user

**FixedCosts** - Regular monthly costs
- Items like rent, utilities, insurance
- Used for budget calculations

**Allowance** - User spending budget
- Monthly allowance amount
- Different cadences (weekly, biweekly, monthly)

**RecurringExpenses** - Automated recurring bills
- Frequency options: daily, weekly, monthly, yearly
- Auto-generates expenses based on schedule
- Can be temporarily disabled or have end dates

All queries are automatically filtered by user ID to ensure data privacy.

## Component Library

I built a custom component library with a consistent design system. Here are the main components:

## Component Library

I built a custom component library with a consistent design system. Here are the main components:

**UI Components:**
- Button (multiple variants and sizes)
- Card (with header, body, footer sections)
- Modal (full-featured dialog with backdrop)
- Input (enhanced with icons and validation states)
- Spinner (loading indicators)
- Alert (notification messages)
- Badge (status indicators)
- Tooltip (contextual help)
- Avatar (user profile pictures)

**Layout Components:**
- Container (width constraints and padding)
- Stack (flexbox helper for spacing)
- Divider (visual separators)

**Data Visualization:**
- SpendingTrendChart (area chart showing 6-month trends)
- CategoryBreakdownChart (donut chart for spending by category)
- BudgetProgressBar (animated progress indicator)

**Utility Components:**
- SkeletonLoader (loading placeholders)
- ErrorBoundary (error catching and display)
- LoadingButton (async operation wrapper)
- SkipToMain (accessibility link)

All components follow a consistent design with warm orange/cream colors and smooth animations.

## Testing

I set up comprehensive unit testing with Vitest and React Testing Library. The project has 40 tests covering utilities and components, with 97.56% code coverage (well above the 70% target).

### Running Tests

```bash
npm test                 # Watch mode
npm run test:run         # Run once
npm run test:coverage    # Coverage report
```

### What's Tested

- Utility functions (currency formatting, date handling)
- UI components (Spinner, ErrorBoundary, SkeletonLoader)
- Accessibility features (SkipToMain)
- Error handling and edge cases

All tests are passing and configured to run in CI environments.

## Environment Setup

You'll need these environment variables in a `.env` file:

```env
DATABASE_URL="postgresql://postgres.[PROJECT]:[PASSWORD]@[REGION].pooler.supabase.com:6543/postgres"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

**Getting GitHub OAuth credentials:**
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth app
3. Set the callback URL to `http://localhost:3000/api/auth/callback/github`
4. Copy the client ID and generate a client secret

**Getting a Supabase database:**
1. Sign up at supabase.com
2. Create a new project
3. Copy the connection pooling URL from Settings → Database

## Deployment

The app is currently deployed in production:
- Frontend: Vercel (automatic deployments from main branch)
- Backend: Railway (automatic deployments from main branch)
- Database: Supabase PostgreSQL

For your own deployment, both Vercel and Railway offer free tiers that work well for this project. Just connect your GitHub repository and configure the environment variables in their dashboards.

## Troubleshooting

**Port conflicts:**
If ports 3000 or 4000 are already in use, kill the process:
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9
```

**Database connection issues:**
Check that your DATABASE_URL is correct and using the connection pooler (port 6543, not 5432).

**Authentication errors:**
If you see "Invalid token" errors, sign out and back in to get a fresh token.

**Module resolution errors:**
Clear the Next.js cache:
```bash
cd client
rm -rf .next node_modules/.cache
npm install
```

## What I Learned

Building this project taught me a lot about full-stack development:

- How to structure a monorepo with separate frontend and backend
- Implementing secure authentication with multiple providers
- Working with Prisma ORM and type-safe database queries
- Setting up automated testing and achieving high code coverage
- Deploying separate frontend and backend services
- Building accessible and responsive user interfaces
- Managing user-scoped data in a multi-tenant application

The most challenging parts were getting NextAuth and JWT authentication to work together smoothly, and setting up the automated recurring expense processing. The most rewarding part was seeing everything come together into a polished, production-ready application.

## License

MIT
