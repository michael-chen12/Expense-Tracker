// API client for backend Express server
// This replaces localStorage with actual backend API calls

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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
async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    // NextAuth stores session in a cookie, we'll get it from the session
    const response = await fetch('/api/auth/session');
    const session = await response.json();
    return session?.accessToken || null;
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
}

// Helper to make authenticated requests
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
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
  const endpoint = query ? `/expenses?${query}` : '/expenses';

  return fetchAPI<ExpenseListResponse>(endpoint);
}

// Get single expense
export async function getExpense(id: number): Promise<ExpenseResponse> {
  return fetchAPI<ExpenseResponse>(`/expenses/${id}`);
}

// Create new expense
export async function createExpense(payload: {
  amount: number;
  category: string;
  date: string;
  note?: string;
}): Promise<ExpenseResponse> {
  return fetchAPI<ExpenseResponse>('/expenses', {
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
  return fetchAPI<ExpenseResponse>(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// Delete expense
export async function deleteExpense(id: number): Promise<{ success: boolean }> {
  return fetchAPI<{ success: boolean }>(`/expenses/${id}`, {
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
  const endpoint = query ? `/summary?${query}` : '/summary';

  return fetchAPI<SummaryResponse>(endpoint);
}

// Fixed costs and allowance will be added later when we implement those endpoints
// For now, these return empty data to maintain compatibility
export async function getFixedCosts(): Promise<any[]> {
  // TODO: Implement backend endpoint
  return [];
}

export async function createFixedCost(payload: any): Promise<any> {
  // TODO: Implement backend endpoint
  throw new Error('Not implemented yet');
}

export async function deleteFixedCost(id: number): Promise<any> {
  // TODO: Implement backend endpoint
  throw new Error('Not implemented yet');
}

export function getAllowanceSettings(): any {
  // TODO: Implement backend endpoint
  return { amount: 0, cadence: 'month' };
}

export function setAllowanceSettings(settings: any): any {
  // TODO: Implement backend endpoint
  throw new Error('Not implemented yet');
}

export async function getAllowanceStatus(referenceDate?: Date): Promise<any> {
  // TODO: Implement backend endpoint
  return {
    settings: { amount: 0, cadence: 'month' },
    label: 'This month',
    startDate: '',
    endDate: '',
    nextTopUp: '',
    totalSpent: 0,
    remaining: 0,
  };
}
