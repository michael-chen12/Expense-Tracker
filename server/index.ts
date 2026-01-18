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

// Helper to resolve user ID (handles both internal ID and GitHub ID)
async function resolveUserId(authId: string | undefined): Promise<string | null> {
  if (!authId) return null;
  
  // Try to find by internal ID first
  let user = await prisma.user.findUnique({
    where: { id: authId }
  });
  
  // If not found, try GitHub ID
  if (!user) {
    user = await prisma.user.findUnique({
      where: { githubId: authId }
    });
  }
  
  return user?.id || null;
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
      const resolvedUserId = await resolveUserId(req.userId);
      if (resolvedUserId) {
        where.userId = resolvedUserId;
      }
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
      const resolvedUserId = await resolveUserId(req.userId);
      if (resolvedUserId) {
        where.userId = resolvedUserId;
      }
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
    console.log('[POST /api/expenses] Request body:', req.body);
    console.log('[POST /api/expenses] User ID from auth:', req.userId);
    
    // Require authentication
    if (!req.userId) {
      return res.status(401).json({ error: 'Authentication required to create expenses.' });
    }

    const amountCents = parseAmountToCents(req.body.amount);
    if (amountCents === null) {
      console.log('[POST /api/expenses] Invalid amount:', req.body.amount);
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    const category = String(req.body.category || '').trim();
    if (!category) {
      console.log('[POST /api/expenses] Missing category');
      return res.status(400).json({ error: 'Category is required.' });
    }

    const date = String(req.body.date || '').trim();
    if (!date) {
      console.log('[POST /api/expenses] Missing date');
      return res.status(400).json({ error: 'Date is required.' });
    }

    const note = req.body.note ? String(req.body.note).trim() : '';
    
    // Look up user by ID or GitHub ID
    let user = await prisma.user.findUnique({
      where: { id: req.userId }
    });
    
    // If not found by ID, try to find by GitHub ID
    if (!user) {
      user = await prisma.user.findUnique({
        where: { githubId: req.userId }
      });
    }
    
    if (!user) {
      console.log('[POST /api/expenses] User not found:', req.userId);
      return res.status(401).json({ error: 'User not found. Please sign in again.' });
    }
    
    console.log('[POST /api/expenses] Found user:', user.id, user.email);

    const expense = await prisma.expense.create({
      data: {
        userId: user.id,
        amountCents,
        category,
        date,
        note
      }
    });

    console.log('[POST /api/expenses] Created expense:', expense.id);

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
    console.error('[POST /api/expenses] Error creating expense:', error instanceof Error ? error.message : error);
    console.error('[POST /api/expenses] Full error:', error);
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
      const resolvedUserId = await resolveUserId(req.userId);
      if (resolvedUserId) {
        where.userId = resolvedUserId;
      }
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
      const resolvedUserId = await resolveUserId(req.userId);
      if (resolvedUserId) {
        where.userId = resolvedUserId;
      }
    }

    const result = await prisma.expense.deleteMany({
      where
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Expense not found.' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense.' });
  }
});

// ============================================
// Summary Endpoints
// ============================================

// Get summary of expenses (total and by category) for authenticated user
app.get('/api/summary', optionalAuth, async (req: Request, res: Response) => {
  try {
    const where: any = {};

    // Filter by userId if authenticated
    if (req.userId) {
      const resolvedUserId = await resolveUserId(req.userId);
      if (resolvedUserId) {
        where.userId = resolvedUserId;
      }
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
      select: { amountCents: true, category: true }
    });

    const totalCents = expenses.reduce((sum, e) => sum + e.amountCents, 0);

    const categoryMap = new Map<string, number>();
    expenses.forEach(expense => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.amountCents);
    });

    const byCategory = Array.from(categoryMap.entries())
      .map(([category, cents]) => ({
        category,
        totalCents: cents,
        total: centsToDollars(cents)
      }))
      .sort((a, b) => b.totalCents - a.totalCents);

    res.json({ totalCents, total: centsToDollars(totalCents), byCategory });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to load summary.' });
  }
});

// ============================================
// Fixed Costs Endpoints
// ============================================

// Get fixed costs for authenticated user
app.get('/api/fixed-costs', optionalAuth, async (req: Request, res: Response) => {
  try {
    const where: any = {};

    // Filter by userId if authenticated
    if (req.userId) {
      const resolvedUserId = await resolveUserId(req.userId);
      if (resolvedUserId) {
        where.userId = resolvedUserId;
      }
    }

    const fixedCosts = await prisma.fixedCost.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    const items = fixedCosts.map(cost => ({
      id: cost.id,
      name: cost.name,
      amount: centsToDollars(cost.amountCents),
      createdAt: cost.createdAt.toISOString(),
      updatedAt: cost.updatedAt.toISOString(),
      userId: cost.userId
    }));

    res.json({ items });
  } catch (error) {
    console.error('Error fetching fixed costs:', error);
    res.status(500).json({ error: 'Failed to load fixed costs.' });
  }
});

// Create fixed cost
app.post('/api/fixed-costs', optionalAuth, async (req: Request, res: Response) => {
  try {
    // Require authentication
    if (!req.userId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const amountCents = parseAmountToCents(req.body.amount);
    if (amountCents === null) {
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    const name = String(req.body.name || '').trim();
    if (!name) {
      return res.status(400).json({ error: 'Name is required.' });
    }

    // Look up user by ID or GitHub ID
    let user = await prisma.user.findUnique({
      where: { id: req.userId }
    });
    
    // If not found by ID, try to find by GitHub ID
    if (!user) {
      user = await prisma.user.findUnique({
        where: { githubId: req.userId }
      });
    }
    
    if (!user) {
      console.log('[POST /api/fixed-costs] User not found:', req.userId);
      return res.status(401).json({ error: 'User not found. Please sign in again.' });
    }
    
    console.log('[POST /api/fixed-costs] Found user:', user.id, user.email);

    const fixedCost = await prisma.fixedCost.create({
      data: {
        userId: user.id,
        name,
        amountCents
      }
    });

    res.status(201).json({
      item: {
        id: fixedCost.id,
        name: fixedCost.name,
        amount: centsToDollars(fixedCost.amountCents),
        createdAt: fixedCost.createdAt.toISOString(),
        updatedAt: fixedCost.updatedAt.toISOString(),
        userId: fixedCost.userId
      }
    });
  } catch (error) {
    console.error('Error creating fixed cost:', error);
    res.status(500).json({ error: 'Failed to create fixed cost.' });
  }
});

// Delete fixed cost
app.delete('/api/fixed-costs/:id', optionalAuth, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid fixed cost id.' });
    }

    // Build where clause with userId filter if authenticated
    const where: any = { id };
    if (req.userId) {
      const resolvedUserId = await resolveUserId(req.userId);
      if (resolvedUserId) {
        where.userId = resolvedUserId;
      }
    }

    const result = await prisma.fixedCost.deleteMany({
      where
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Fixed cost not found.' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting fixed cost:', error);
    res.status(500).json({ error: 'Failed to delete fixed cost.' });
  }
});

// ============================================
// Allowance Endpoints
// ============================================

const VALID_CADENCES = ['day', 'week', 'month'];

// Get allowance settings for authenticated user
app.get('/api/allowance', optionalAuth, async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.json({ amount: 0, cadence: 'month' });
    }

    const resolvedUserId = await resolveUserId(req.userId);
    if (!resolvedUserId) {
      return res.json({ amount: 0, cadence: 'month' });
    }

    const allowance = await prisma.allowance.findUnique({
      where: { userId: resolvedUserId }
    });

    if (!allowance) {
      return res.json({ amount: 0, cadence: 'month' });
    }

    res.json({
      amount: centsToDollars(allowance.amountCents),
      cadence: allowance.cadence
    });
  } catch (error) {
    console.error('Error fetching allowance:', error);
    res.status(500).json({ error: 'Failed to load allowance.' });
  }
});

// Set allowance settings
app.put('/api/allowance', optionalAuth, async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const amountCents = parseAmountToCents(req.body.amount);
    if (amountCents === null) {
      return res.status(400).json({ error: 'Amount must be a positive number.' });
    }

    const cadence = String(req.body.cadence || '').trim();
    if (!VALID_CADENCES.includes(cadence)) {
      return res.status(400).json({ error: 'Cadence must be day, week, or month.' });
    }

    const resolvedUserId = await resolveUserId(req.userId);
    if (!resolvedUserId) {
      return res.status(401).json({ error: 'User not found. Please sign in again.' });
    }

    const allowance = await prisma.allowance.upsert({
      where: { userId: resolvedUserId },
      update: { amountCents, cadence },
      create: { userId: resolvedUserId, amountCents, cadence }
    });

    res.json({
      amount: centsToDollars(allowance.amountCents),
      cadence: allowance.cadence
    });
  } catch (error) {
    console.error('Error saving allowance:', error);
    res.status(500).json({ error: 'Failed to save allowance.' });
  }
});

// Get allowance status (settings + spending for current period)
app.get('/api/allowance/status', optionalAuth, async (req: Request, res: Response) => {
  try {
    const defaultStatus = {
      settings: { amount: 0, cadence: 'month' },
      label: 'This month',
      startDate: '',
      endDate: '',
      nextTopUp: '',
      totalSpent: 0,
      remaining: 0
    };

    if (!req.userId) {
      return res.json(defaultStatus);
    }

    const resolvedUserId = await resolveUserId(req.userId);
    if (!resolvedUserId) {
      return res.json(defaultStatus);
    }

    const allowance = await prisma.allowance.findUnique({
      where: { userId: resolvedUserId }
    });

    const settings = allowance
      ? { amount: centsToDollars(allowance.amountCents), cadence: allowance.cadence }
      : { amount: 0, cadence: 'month' };

    // Calculate period window
    const now = new Date();
    let label: string;
    let startDate: string;
    let endDate: string;
    let nextTopUp: string;

    if (settings.cadence === 'day') {
      label = 'Today';
      startDate = formatDate(now);
      endDate = formatDate(now);
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      nextTopUp = formatDate(tomorrow);
    } else if (settings.cadence === 'week') {
      label = 'This week';
      const dayOfWeek = now.getDay();
      const diff = (dayOfWeek + 6) % 7;
      const start = new Date(now);
      start.setDate(start.getDate() - diff);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      startDate = formatDate(start);
      endDate = formatDate(end);
      const next = new Date(end);
      next.setDate(next.getDate() + 1);
      nextTopUp = formatDate(next);
    } else {
      label = 'This month';
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      startDate = formatDate(start);
      endDate = formatDate(end);
      const next = new Date(end);
      next.setDate(next.getDate() + 1);
      nextTopUp = formatDate(next);
    }

    // Get expenses in period
    const expenses = await prisma.expense.findMany({
      where: {
        userId: resolvedUserId,
        date: { gte: startDate, lte: endDate }
      },
      select: { amountCents: true }
    });

    const totalSpentCents = expenses.reduce((sum, e) => sum + e.amountCents, 0);
    const totalSpent = centsToDollars(totalSpentCents);
    const remaining = Number((settings.amount - totalSpent).toFixed(2));

    res.json({
      settings,
      label,
      startDate,
      endDate,
      nextTopUp,
      totalSpent,
      remaining
    });
  } catch (error) {
    console.error('Error fetching allowance status:', error);
    res.status(500).json({ error: 'Failed to load allowance status.' });
  }
});

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Sync user (called by NextAuth on sign-in)
app.post('/api/users/sync', async (req: Request, res: Response) => {
  try {
    const { email, githubId, name } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Create new user
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
