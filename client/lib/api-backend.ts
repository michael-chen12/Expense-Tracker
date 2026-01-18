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
    } else if (session?.user?.id) {
      headers['X-User-Id'] = session.user.id;
    }
    
    if (session?.accessToken) {
      headers['Authorization'] = `Bearer ${session.accessToken}`;
    }
    
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
// Fixed Costs
// ============================================

interface FixedCost {
  id: number;
  name: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface FixedCostListResponse {
  items: FixedCost[];
}

interface FixedCostResponse {
  item: FixedCost;
}

export async function getFixedCosts(): Promise<FixedCost[]> {
  const response = await fetchAPI<FixedCostListResponse>('/api/fixed-costs');
  return response.items;
}

export async function createFixedCost(payload: { name: string; amount: number }): Promise<FixedCostResponse> {
  return fetchAPI<FixedCostResponse>('/api/fixed-costs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteFixedCost(id: number): Promise<{ success: boolean }> {
  return fetchAPI<{ success: boolean }>(`/api/fixed-costs/${id}`, {
    method: 'DELETE',
  });
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
