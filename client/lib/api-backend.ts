// API client for backend Express server
// This replaces localStorage with actual backend API calls

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface APIError {
  error: string;
}

interface Expense {
  id: number;
  amount: number;
  category: string;
  date: string;
  note: string;
  createdAt: string;
  userId: string;
}

interface ExpenseListResponse {
  items: Expense[];
  page: number;
  pageSize: number;
  totalCount: number;
}

interface ExpenseResponse {
  item: Expense;
}

interface SummaryResponse {
  totalCents: number;
  total: number;
  byCategory: Array<{
    category: string;
    totalCents: number;
    total: number;
  }>;
}

// Helper to get auth token from NextAuth session
async function getAuthHeaders(): Promise<HeadersInit> {
  if (typeof window === 'undefined') {
    return { 'Content-Type': 'application/json' };
  }

  try {
    const response = await fetch('/api/auth/session');
    const session = await response.json();
    console.log('[API] Session:', session);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Pass user ID in header for backend to use
    if (session?.userId) {
      headers['X-User-Id'] = session.userId;
      console.log('[API] Using session.userId:', session.userId);
    } else if (session?.user?.id) {
      headers['X-User-Id'] = session.user.id;
      console.log('[API] Using session.user.id:', session.user.id);
    } else {
      console.warn('[API] No user ID found in session!');
    }

    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
      console.log('[API] Added Authorization header');
    } else {
      console.warn('[API] No access token found in session!');
    }

    console.log('[API] Final headers:', headers);
    return headers;
  } catch (error) {
    console.error('Failed to get auth session:', error);
    return { 'Content-Type': 'application/json' };
  }
}

// Helper to make authenticated requests
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error: APIError = await response.json().catch(() => ({
      error: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

// Get expenses with pagination and filtering
export async function getExpenses(params: {
  from?: string;
  to?: string;
  category?: string;
  page?: number;
  pageSize?: number;
} = {}): Promise<ExpenseListResponse> {
  const searchParams = new URLSearchParams();

  if (params.from) searchParams.set('from', params.from);
  if (params.to) searchParams.set('to', params.to);
  if (params.category) searchParams.set('category', params.category);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString());

  const query = searchParams.toString();
  const endpoint = query ? `/api/expenses?${query}` : '/api/expenses';

  return fetchAPI<ExpenseListResponse>(endpoint);
}

// Get single expense
export async function getExpense(id: number): Promise<ExpenseResponse> {
  return fetchAPI<ExpenseResponse>(`/api/expenses/${id}`);
}

// Create new expense
export async function createExpense(payload: {
  amount: number;
  category: string;
  date: string;
  note?: string;
}): Promise<ExpenseResponse> {
  return fetchAPI<ExpenseResponse>('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Update expense
export async function updateExpense(
  id: number,
  payload: {
    amount: number;
    category: string;
    date: string;
    note?: string;
  }
): Promise<ExpenseResponse> {
  return fetchAPI<ExpenseResponse>(`/api/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// Delete expense
export async function deleteExpense(id: number): Promise<{ success: boolean }> {
  return fetchAPI<{ success: boolean }>(`/api/expenses/${id}`, {
    method: 'DELETE',
  });
}

// Get summary
export async function getSummary(params: {
  from?: string;
  to?: string;
  category?: string;
} = {}): Promise<SummaryResponse> {
  const searchParams = new URLSearchParams();

  if (params.from) searchParams.set('from', params.from);
  if (params.to) searchParams.set('to', params.to);
  if (params.category) searchParams.set('category', params.category);

  const query = searchParams.toString();
  const endpoint = query ? `/api/summary?${query}` : '/api/summary';

  return fetchAPI<SummaryResponse>(endpoint);
}

// ============================================
// Allowance
// ============================================

interface AllowanceSettings {
  amount: number;
  cadence: string;
}

interface AllowanceStatus {
  settings: AllowanceSettings;
  label: string;
  startDate: string;
  endDate: string;
  nextTopUp: string;
  totalSpent: number;
  remaining: number;
}

export async function getAllowanceSettings(): Promise<AllowanceSettings> {
  return fetchAPI<AllowanceSettings>('/api/allowance');
}

export async function setAllowanceSettings(settings: { amount: number | string; cadence: string }): Promise<AllowanceSettings> {
  return fetchAPI<AllowanceSettings>('/api/allowance', {
    method: 'PUT',
    body: JSON.stringify({
      amount: Number(settings.amount),
      cadence: settings.cadence
    }),
  });
}

export async function getAllowanceStatus(): Promise<AllowanceStatus> {
  return fetchAPI<AllowanceStatus>('/api/allowance/status');
}
// ============================================
// Recurring Expenses
// ============================================

export interface RecurringExpense {
  id: number;
  amount: number;
  category: string;
  note: string;
  frequency: string;
  dayOfWeek?: number | null;
  dayOfMonth?: number | null;
  monthOfYear?: number | null;
  nextDate: string;
  endDate?: string | null;
  isActive: boolean;
  createdAt: string;
}

interface RecurringExpenseListResponse {
  items: RecurringExpense[];
}

interface RecurringExpenseResponse {
  item: RecurringExpense;
}

export async function getRecurringExpenses(): Promise<RecurringExpense[]> {
  const response = await fetchAPI<RecurringExpenseListResponse>('/api/recurring-expenses');
  return response.items;
}

export async function getRecurringExpense(id: number): Promise<RecurringExpense> {
  const response = await fetchAPI<RecurringExpenseResponse>(`/api/recurring-expenses/${id}`);
  return response.item;
}

export async function createRecurringExpense(payload: {
  amount: number;
  category: string;
  note?: string;
  frequency: string;
  dayOfWeek?: number | null;
  dayOfMonth?: number | null;
  monthOfYear?: number | null;
  nextDate?: string;
  endDate?: string | null;
}): Promise<RecurringExpense> {
  const response = await fetchAPI<RecurringExpenseResponse>('/api/recurring-expenses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.item;
}

export async function updateRecurringExpense(
  id: number,
  payload: Partial<{
    amount: number;
    category: string;
    note?: string;
    frequency: string;
    dayOfWeek?: number | null;
    dayOfMonth?: number | null;
    monthOfYear?: number | null;
    nextDate?: string;
    endDate?: string | null;
    isActive: boolean;
  }>
): Promise<RecurringExpense> {
  const response = await fetchAPI<RecurringExpenseResponse>(`/api/recurring-expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response.item;
}

export async function deleteRecurringExpense(id: number): Promise<{ success: boolean }> {
  return fetchAPI<{ success: boolean }>(`/api/recurring-expenses/${id}`, {
    method: 'DELETE',
  });
}

export async function processRecurringExpenses(): Promise<{ processed: { created: number; updated: number } }> {
  return fetchAPI<{ processed: { created: number; updated: number } }>('/api/recurring-expenses/process', {
    method: 'POST',
  });
}