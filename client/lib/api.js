const STORAGE_KEY = 'ledgerline.expenses';
const ALLOWANCE_KEY_PREFIX = 'ledgerline.allowance';
const FIXED_COST_KEY_PREFIX = 'ledgerline.fixedCosts';
const DEFAULT_ALLOWANCE = { amount: 0, cadence: 'month' };

function getAllowanceKey(userId) {
  if (!userId) {
    return ALLOWANCE_KEY_PREFIX;
  }
  return `${ALLOWANCE_KEY_PREFIX}.${userId}`;
}

function getFixedCostKey(userId) {
  if (!userId) {
    return FIXED_COST_KEY_PREFIX;
  }
  return `${FIXED_COST_KEY_PREFIX}.${userId}`;
}

const ALLOWANCE_CADENCES = new Set(['day', 'week', 'month']);

function readExpenses() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeExpenses(expenses) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function readFixedCosts(userId) {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const key = getFixedCostKey(userId);
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeFixedCosts(items, userId) {
  if (typeof window === 'undefined') {
    return;
  }
  const key = getFixedCostKey(userId);
  window.localStorage.setItem(key, JSON.stringify(items));
}

function readAllowance(userId) {
  if (typeof window === 'undefined') {
    return DEFAULT_ALLOWANCE;
  }

  try {
    const key = getAllowanceKey(userId);
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return DEFAULT_ALLOWANCE;
    }
    const parsed = JSON.parse(raw);
    return normalizeAllowance(parsed);
  } catch (error) {
    return DEFAULT_ALLOWANCE;
  }
}

function writeAllowance(settings, userId) {
  if (typeof window === 'undefined') {
    return;
  }
  const key = getAllowanceKey(userId);
  window.localStorage.setItem(key, JSON.stringify(settings));
}

function normalizeAllowance(settings) {
  const amount = Number(settings?.amount);
  const cadence = ALLOWANCE_CADENCES.has(settings?.cadence) ? settings.cadence : 'month';

  if (!Number.isFinite(amount) || amount < 0) {
    return { ...DEFAULT_ALLOWANCE, cadence };
  }

  return {
    amount: Number(amount.toFixed(2)),
    cadence
  };
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(date, amount) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
  return next;
}

function getAllowanceWindow(referenceDate, cadence) {
  const base = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  if (cadence === 'day') {
    const start = base;
    const end = base;
    return {
      label: 'Today',
      startKey: formatDateKey(start),
      endKey: formatDateKey(end),
      nextTopUp: formatDateKey(addDays(end, 1))
    };
  }

  if (cadence === 'week') {
    const dayOfWeek = base.getDay();
    const diff = (dayOfWeek + 6) % 7;
    const start = addDays(base, -diff);
    const end = addDays(start, 6);
    return {
      label: 'This week',
      startKey: formatDateKey(start),
      endKey: formatDateKey(end),
      nextTopUp: formatDateKey(addDays(end, 1))
    };
  }

  const start = new Date(base.getFullYear(), base.getMonth(), 1);
  const end = new Date(base.getFullYear(), base.getMonth() + 1, 0);
  return {
    label: 'This month',
    startKey: formatDateKey(start),
    endKey: formatDateKey(end),
    nextTopUp: formatDateKey(addDays(end, 1))
  };
}

function sortExpenses(expenses) {
  return [...expenses].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date > b.date ? -1 : 1;
    }
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });
}

function sortFixedCosts(items) {
  return [...items].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

function validateExpense(payload) {
  const amount = Number(payload.amount);
  if (!Number.isFinite(amount) || amount < 0) {
    return { error: 'Amount must be a positive number.' };
  }

  const category = String(payload.category || '').trim();
  if (!category) {
    return { error: 'Category is required.' };
  }

  const date = String(payload.date || '').trim();
  if (!date) {
    return { error: 'Date is required.' };
  }

  const note = payload.note ? String(payload.note).trim() : '';

  return {
    value: {
      amount: Number(amount.toFixed(2)),
      category,
      date,
      note
    }
  };
}

function validateFixedCost(payload) {
  const name = String(payload.name || '').trim();
  if (!name) {
    return { error: 'Name is required.' };
  }

  const amount = Number(payload.amount);
  if (!Number.isFinite(amount) || amount < 0) {
    return { error: 'Amount must be a positive number.' };
  }

  return {
    value: {
      name,
      amount: Number(amount.toFixed(2))
    }
  };
}

function paginate(items, page = 1, pageSize = 20) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safePageSize = Math.min(Math.max(Number(pageSize) || 20, 1), 100);
  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;

  return {
    items: items.slice(start, end),
    page: safePage,
    pageSize: safePageSize,
    totalCount: items.length
  };
}

export async function getExpenses(params = {}) {
  const { from, to, category, page, pageSize } = params;
  const allExpenses = readExpenses();

  const filtered = allExpenses.filter((expense) => {
    if (category && expense.category !== category) {
      return false;
    }

    if (from && expense.date < from) {
      return false;
    }

    if (to && expense.date > to) {
      return false;
    }

    return true;
  });

  const sorted = sortExpenses(filtered);
  return paginate(sorted, page, pageSize);
}

export async function getExpense(id) {
  const expenses = readExpenses();
  const item = expenses.find((expense) => expense.id === Number(id));
  if (!item) {
    throw new Error('Expense not found.');
  }
  return { item };
}

export async function createExpense(payload) {
  const { value, error } = validateExpense(payload);
  if (error) {
    throw new Error(error);
  }

  const expenses = readExpenses();
  const now = new Date().toISOString();
  const nextId = expenses.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  const item = {
    id: nextId,
    ...value,
    createdAt: now
  };

  const updated = sortExpenses([item, ...expenses]);
  writeExpenses(updated);

  return { item };
}

export async function updateExpense(id, payload) {
  const { value, error } = validateExpense(payload);
  if (error) {
    throw new Error(error);
  }

  const expenseId = Number(id);
  const expenses = readExpenses();
  const index = expenses.findIndex((expense) => expense.id === expenseId);

  if (index === -1) {
    throw new Error('Expense not found.');
  }

  const updatedExpense = {
    ...expenses[index],
    ...value
  };

  const updatedExpenses = [...expenses];
  updatedExpenses[index] = updatedExpense;
  writeExpenses(sortExpenses(updatedExpenses));

  return { item: updatedExpense };
}

export async function deleteExpense(id) {
  const expenseId = Number(id);
  const expenses = readExpenses();
  const updated = expenses.filter((expense) => expense.id !== expenseId);

  if (updated.length === expenses.length) {
    throw new Error('Expense not found.');
  }

  writeExpenses(updated);
  return { success: true };
}

export async function getSummary(params = {}) {
  const { from, to, category } = params;
  const expenses = await getExpenses({ from, to, category, page: 1, pageSize: 10000 });

  const byCategoryMap = new Map();
  let total = 0;

  expenses.items.forEach((expense) => {
    total += expense.amount;
    const current = byCategoryMap.get(expense.category) || 0;
    byCategoryMap.set(expense.category, current + expense.amount);
  });

  const byCategory = Array.from(byCategoryMap.entries())
    .map(([name, amount]) => ({
      category: name,
      totalCents: Math.round(amount * 100),
      total: Number(amount.toFixed(2))
    }))
    .sort((a, b) => b.total - a.total);

  return {
    totalCents: Math.round(total * 100),
    total: Number(total.toFixed(2)),
    byCategory
  };
}

export async function getFixedCosts(userId) {
  return sortFixedCosts(readFixedCosts(userId));
}

export async function createFixedCost(payload, userId) {
  const { value, error } = validateFixedCost(payload);
  if (error) {
    throw new Error(error);
  }

  const items = readFixedCosts(userId);
  const now = new Date().toISOString();
  const nextId = items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
  const item = {
    id: nextId,
    ...value,
    createdAt: now
  };

  const updated = sortFixedCosts([item, ...items]);
  writeFixedCosts(updated, userId);

  return { item };
}

export async function deleteFixedCost(id, userId) {
  const itemId = Number(id);
  const items = readFixedCosts(userId);
  const updated = items.filter((item) => item.id !== itemId);

  if (updated.length === items.length) {
    throw new Error('Fixed cost not found.');
  }

  writeFixedCosts(updated, userId);
  return { success: true };
}

export function getAllowanceSettings(userId) {
  return readAllowance(userId);
}

export function setAllowanceSettings(settings, userId) {
  const normalized = normalizeAllowance(settings);

  if (!Number.isFinite(Number(settings?.amount)) || Number(settings.amount) < 0) {
    throw new Error('Allowance amount must be a positive number.');
  }

  if (!ALLOWANCE_CADENCES.has(settings?.cadence)) {
    throw new Error('Allowance cadence must be daily, weekly, or monthly.');
  }

  writeAllowance(normalized, userId);
  return normalized;
}

export async function getAllowanceStatus(userId, referenceDate = new Date()) {
  const settings = readAllowance(userId);
  const { label, startKey, endKey, nextTopUp } = getAllowanceWindow(referenceDate, settings.cadence);
  const expenses = readExpenses();

  const periodExpenses = expenses.filter(
    (expense) => expense.date >= startKey && expense.date <= endKey
  );

  const totalSpent = periodExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const remaining = Number((settings.amount - totalSpent).toFixed(2));

  return {
    settings,
    label,
    startDate: startKey,
    endDate: endKey,
    nextTopUp,
    totalSpent: Number(totalSpent.toFixed(2)),
    remaining
  };
}
