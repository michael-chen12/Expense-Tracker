/// <reference path="./types/express.d.ts" />

import dotenv from 'dotenv';
import path from 'path';

// Load .env from root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { prisma } from './lib/prisma';
import { authenticateToken, optionalAuth } from './middleware/auth';

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

// Utility functions
function parseAmountToCents(value: any): number | null {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }
  return Math.round(amount * 100);
}

function centsToDollars(cents: number): number {
  return Number((cents / 100).toFixed(2));
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// ============================================
// Authentication Endpoints
// ============================================

// Register new user with email/password
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { createId } = await import('@paralleldrive/cuid2');
    const user = await prisma.user.create({
      data: {
        id: createId(),
        email,
        password: hashedPassword,
        name: name || null
      }
    });

    console.log('Created new user via registration:', user.email);

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login with email/password (for validation)
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// ============================================
// Expense Endpoints
// ============================================

// Get expenses with pagination and filtering
app.get('/api/expenses', optionalAuth, async (req: Request, res: Response) => {
  try {
    const page = Math.max(parseInt(req.query.page as string, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize as string, 10) || 20, 1), 100);
    const offset = (page - 1) * pageSize;

    // Build filters
    const where: any = {};

    // Filter by userId if authenticated
    if (req.userId) {
      where.userId = req.userId;
    }

    if (req.query.from) {
      where.date = { ...where.date, gte: req.query.from as string };
    }
    if (req.query.to) {
      where.date = { ...where.date, lte: req.query.to as string };
    }
    if (req.query.category) {
      where.category = req.query.category as string;
    }

    const [expenses, totalCount] = await Promise.all([
      prisma.expense.findMany({
        where,
        orderBy: [
          { date: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: offset,
        take: pageSize
      }),
      prisma.expense.count({ where })
    ]);

    const items = expenses.map(expense => ({
      id: expense.id,
      amount: centsToDollars(expense.amountCents),
      category: expense.category,
      date: expense.date,
      note: expense.note || '',
      createdAt: expense.createdAt.toISOString(),
      userId: expense.userId
    }));

    res.json({
      items,
      page,
      pageSize,
      totalCount
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to load expenses.' });
  }
});

// Get single expense
app.get('/api/expenses/:id', optionalAuth, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid expense id.' });
    }

    const where: any = { id };

    // Filter by userId if authenticated
    if (req.userId) {
      where.userId = req.userId;
    }

    const expense = await prisma.expense.findFirst({
      where
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    res.json({
      item: {
        id: expense.id,
        amount: centsToDollars(expense.amountCents),
        category: expense.category,
        date: expense.date,
        note: expense.note || '',
        createdAt: expense.createdAt.toISOString(),
        userId: expense.userId
      }
    });
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ error: 'Failed to load expense.' });
  }
});

// Create expense
app.post('/api/expenses', optionalAuth, async (req: Request, res: Response) => {
  try {
    const amountCents = parseAmountToCents(req.body.amount);
    if (amountCents === null) {
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    const category = String(req.body.category || '').trim();
    if (!category) {
      return res.status(400).json({ error: 'Category is required.' });
    }

    const date = String(req.body.date || '').trim();
    if (!date) {
      return res.status(400).json({ error: 'Date is required.' });
    }

    const note = req.body.note ? String(req.body.note).trim() : '';

    // Use authenticated userId or fallback to temp (for development)
    const userId = req.userId || req.body.userId || 'temp-user-id';

    const expense = await prisma.expense.create({
      data: {
        userId,
        amountCents,
        category,
        date,
        note
      }
    });

    res.status(201).json({
      item: {
        id: expense.id,
        amount: centsToDollars(expense.amountCents),
        category: expense.category,
        date: expense.date,
        note: expense.note || '',
        createdAt: expense.createdAt.toISOString(),
        userId: expense.userId
      }
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense.' });
  }
});

// Update expense
app.put('/api/expenses/:id', optionalAuth, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid expense id.' });
    }

    const amountCents = parseAmountToCents(req.body.amount);
    if (amountCents === null) {
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    const category = String(req.body.category || '').trim();
    if (!category) {
      return res.status(400).json({ error: 'Category is required.' });
    }

    const date = String(req.body.date || '').trim();
    if (!date) {
      return res.status(400).json({ error: 'Date is required.' });
    }

    const note = req.body.note ? String(req.body.note).trim() : '';

    // Build where clause with userId filter if authenticated
    const where: any = { id };
    if (req.userId) {
      where.userId = req.userId;
    }

    const expense = await prisma.expense.updateMany({
      where,
      data: {
        amountCents,
        category,
        date,
        note
      }
    });

    // Check if any rows were updated
    if (expense.count === 0) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    // Fetch the updated expense
    const updatedExpense = await prisma.expense.findUnique({
      where: { id }
    });

    if (!updatedExpense) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    res.json({
      item: {
        id: updatedExpense.id,
        amount: centsToDollars(updatedExpense.amountCents),
        category: updatedExpense.category,
        date: updatedExpense.date,
        note: updatedExpense.note || '',
        createdAt: updatedExpense.createdAt.toISOString(),
        userId: updatedExpense.userId
      }
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Expense not found.' });
    }
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense.' });
  }
});

// Delete expense
app.delete('/api/expenses/:id', optionalAuth, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid expense id.' });
    }

    // Build where clause with userId filter if authenticated
    const where: any = { id };
    if (req.userId) {
      where.userId = req.userId;
    }

    const result = await prisma.expense.deleteMany({
      where
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense.' });
  }
});

// Get summary
app.get('/api/summary', optionalAuth, async (req: Request, res: Response) => {
  try {
    // Build filters
    const where: any = {};

    // Filter by userId if authenticated
    if (req.userId) {
      where.userId = req.userId;
    }

    if (req.query.from) {
      where.date = { ...where.date, gte: req.query.from as string };
    }
    if (req.query.to) {
      where.date = { ...where.date, lte: req.query.to as string };
    }
    if (req.query.category) {
      where.category = req.query.category as string;
    }

    const expenses = await prisma.expense.findMany({
      where,
      select: {
        amountCents: true,
        category: true
      }
    });

    const totalCents = expenses.reduce((sum, e) => sum + e.amountCents, 0);

    const categoryMap = new Map<string, number>();
    expenses.forEach(expense => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.amountCents);
    });

    const byCategory = Array.from(categoryMap.entries())
      .map(([category, totalCents]) => ({
        category,
        totalCents,
        total: centsToDollars(totalCents)
      }))
      .sort((a, b) => b.totalCents - a.totalCents);

    res.json({
      totalCents,
      total: centsToDollars(totalCents),
      byCategory
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to load summary.' });
  }
});

// Sync user (called by NextAuth on sign-in)
app.post('/api/users/sync', async (req: Request, res: Response) => {
  try {
    const { email, githubId, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Create new user with cuid
      const { createId } = await import('@paralleldrive/cuid2');
      user = await prisma.user.create({
        data: {
          id: createId(),
          email,
          githubId,
          name
        }
      });
      console.log('Created new user:', user.email);
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { email },
        data: {
          githubId: githubId || user.githubId,
          name: name || user.name
        }
      });
      console.log('Updated existing user:', user.email);
    }

    res.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Expense API running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, closing server...');
  await prisma.$disconnect();
  process.exit(0);
});
