const STORAGE_KEY = 'ledgerline.expenses';

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

function sortExpenses(expenses) {
  return [...expenses].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date > b.date ? -1 : 1;
    }
    return (b.createdAt || '').localeCompare(a.createdAt || '');
  });
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
