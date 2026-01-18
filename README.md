# Expense Tracker (Ledgerline)

A production-ready full-stack expense tracker built with Next.js, Express, PostgreSQL, and Prisma ORM.

## 🚀 Features

- ✅ **Full-Stack Architecture**: Next.js frontend + Express.js backend
- ✅ **PostgreSQL Database**: Production-ready database with Prisma ORM
- ✅ **Multi-User Support**: User-scoped data with JWT authentication
- ✅ **GitHub OAuth**: Secure authentication via NextAuth.js
- ✅ **TypeScript**: Type-safe development across the stack
- 🚧 **Testing** (Coming in Phase 2): 70%+ code coverage
- 🚧 **CI/CD** (Coming in Phase 4): GitHub Actions pipeline

## 📚 Documentation

Complete documentation is available in the [`/docs`](docs/) directory:

- **[docs/README.md](docs/README.md)** - Documentation index
- **[docs/phase1/](docs/phase1/)** - Phase 1 (Backend Integration) documentation
  - [SUCCESS.md](docs/phase1/SUCCESS.md) - Success summary and testing guide
  - [QUICK_START.md](docs/phase1/QUICK_START.md) - Quick setup and troubleshooting
  - [PHASE1_SUMMARY.md](docs/phase1/PHASE1_SUMMARY.md) - Complete accomplishments

## 📁 Project Structure

```
expense-tracker/
├── client/          # Next.js frontend application
│   ├── app/         # Next.js 14 app directory
│   ├── components/  # React components
│   ├── lib/         # API client and utilities
│   └── public/      # Static assets
├── server/          # Express.js backend API
│   ├── middleware/  # JWT authentication middleware
│   ├── lib/         # Prisma client
│   └── types/       # TypeScript type definitions
├── prisma/          # Database schema and migrations
├── docs/            # Complete project documentation
│   └── phase1/      # Phase 1 documentation
└── .env             # Environment variables
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14.2.5
- **UI**: React 18
- **Authentication**: NextAuth.js 4.24.7
- **Styling**: CSS Modules

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Language**: TypeScript 5.9.3
- **Database ORM**: Prisma 7.2.0
- **Authentication**: JWT (jsonwebtoken 9.0.3)

### Database
- **Database**: PostgreSQL (Supabase hosted)
- **ORM**: Prisma with PostgreSQL adapter

### Development
- **Hot Reload**: nodemon + Next.js Fast Refresh
- **Process Manager**: concurrently
- **Environment**: dotenv

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (we use Supabase free tier)
- GitHub OAuth App credentials

### 1. Clone and Install

```bash
# Install all dependencies (root, client, server)
npm run install:all
```

### 2. Environment Setup

Create `.env` in the root directory:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[PROJECT]:PASSWORD@aws-region.pooler.supabase.com:6543/postgres"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

**Generate NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### 3. Database Setup

The database tables are already created in your Supabase instance. If starting fresh, run:

```bash
cd server
npx ts-node seed-test-user.ts  # Create a test user
```

### 4. Start Development Servers

**Option A: Start Both Servers Together (Recommended)**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3001 (or 3000 if available)
- Backend API: http://localhost:4000

**Option B: Start Servers Separately**
```bash
# Terminal 1 - Frontend
npm run dev:client

# Terminal 2 - Backend
npm run dev:server
```

## 📝 Available Scripts

### Root Directory
```bash
npm run dev           # Start both frontend and backend
npm run dev:client    # Start frontend only
npm run dev:server    # Start backend only
npm run install:all   # Install dependencies for all packages
```

### Backend (`/server`)
```bash
npm run dev          # Start development server with hot reload
npm run start        # Start production server
npm run build        # Build TypeScript to JavaScript
npx ts-node test-db.ts           # Test database connection
npx ts-node seed-test-user.ts    # Create test user
```

### Frontend (`/client`)
```bash
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run start        # Start production server
```

## 🔐 Authentication Flow

1. User signs in with GitHub OAuth (NextAuth.js)
2. NextAuth creates JWT session with userId
3. Frontend sends JWT token to backend API
4. Backend validates JWT and extracts userId
5. All data queries are scoped to the authenticated user

## 🗄️ Database Schema

```prisma
model User {
  id         String      @id @default(cuid())
  email      String      @unique
  githubId   String?     @unique
  name       String?

  expenses   Expense[]
  fixedCosts FixedCost[]
  allowance  Allowance?
}

model Expense {
  id          Int      @id @default(autoincrement())
  userId      String
  amountCents Int
  category    String
  date        String
  note        String?

  @@index([userId, date])
}

// + FixedCost, Allowance models
```

## 🔧 API Endpoints

All endpoints support optional JWT authentication via `Authorization: Bearer <token>` header.

- `GET /api/health` - Health check
- `GET /api/expenses` - List expenses (paginated, filtered by user)
- `GET /api/expenses/:id` - Get single expense
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/summary` - Get spending summary by category

## 🧪 Testing the API

```bash
# Health check
curl http://localhost:4000/api/health

# Get expenses
curl http://localhost:4000/api/expenses

# Create expense
curl -X POST http://localhost:4000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 25.50,
    "category": "Food",
    "date": "2026-01-17",
    "note": "Lunch"
  }'
```

## 📚 Development Phases

### ✅ Phase 1: Backend Integration & Foundation (Current)
- [x] PostgreSQL database with Prisma ORM
- [x] Multi-user support (user-scoped data)
- [x] JWT authentication middleware
- [x] Single-command development environment
- [ ] Frontend connected to backend API
- [ ] NextAuth userId integration

### 🚧 Phase 2: Testing & Type Safety (Week 2)
- [ ] 100% TypeScript conversion
- [ ] 70%+ code coverage (unit + integration + E2E)
- [ ] Tests run in CI pipeline

### 🚧 Phase 3: Advanced Features & Polish (Week 3)
- [ ] Data visualization (charts/graphs)
- [ ] CSV/PDF export functionality
- [ ] Recurring expense automation
- [ ] Budget alerts and warnings

### 🚧 Phase 4: DevOps & Production Readiness (Week 4)
- [ ] Docker containerization
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Production deployment (Vercel + Railway)
- [ ] Error tracking (Sentry)
- [ ] Comprehensive documentation

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 or 4000 is in use:
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9
```

### Database Connection Issues
1. Verify DATABASE_URL in `.env`
2. Check Supabase project is active
3. Test connection: `cd server && npx ts-node test-db.ts`

### TypeScript Errors
The server uses `--transpile-only` flag for faster development. For type checking:
```bash
cd server && npx tsc --noEmit
```

## 📖 Documentation

- [Phase 1 Progress](PHASE1_PROGRESS.md) - Detailed progress tracking
- [Prisma Schema](prisma/schema.prisma) - Database schema
- [API Middleware](server/middleware/auth.ts) - JWT authentication

## 🤝 Contributing

This is a portfolio project demonstrating production-ready development practices. Contributions welcome!

## 📄 License

MIT

---

**Status**: Phase 1 - ~85% Complete
**Last Updated**: 2026-01-17
