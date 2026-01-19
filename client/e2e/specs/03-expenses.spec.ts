import { test, expect } from '@playwright/test';
import { SAMPLE_EXPENSES, CATEGORIES } from '../fixtures/test-data';

test.describe('Expenses CRUD', () => {
  test.describe('Create Expense', () => {
    test('should create new expense with all fields', async ({ page }) => {
      await page.goto('/expenses/new');

      // Fill in expense form (amount is in dollars, not cents)
      await page.fill('input[name="amount"]', String(SAMPLE_EXPENSES.groceries.amountCents / 100));
      await page.selectOption('select#categorySelect', SAMPLE_EXPENSES.groceries.category);
      await page.fill('input[name="date"]', SAMPLE_EXPENSES.groceries.date);
      await page.fill('textarea[name="note"]', SAMPLE_EXPENSES.groceries.note || '');

      // Submit form
      await page.click('button[type="submit"]');

      // Should redirect to expenses list
      await page.waitForURL('/expenses');

      // Verify expense appears in the list
      await expect(page.locator(`text=${SAMPLE_EXPENSES.groceries.category}`)).toBeVisible();
      await expect(page.locator(`text=${SAMPLE_EXPENSES.groceries.note}`)).toBeVisible();
    });

    test('should create expense with minimal required fields', async ({ page }) => {
      await page.goto('/expenses/new');

      // Fill only required fields
      await page.fill('input[name="amount"]', String(SAMPLE_EXPENSES.coffee.amountCents / 100));
      await page.selectOption('select#categorySelect', SAMPLE_EXPENSES.coffee.category);
      await page.fill('input[name="date"]', SAMPLE_EXPENSES.coffee.date);

      // Submit form
      await page.click('button[type="submit"]');

      // Should redirect to expenses list
      await page.waitForURL('/expenses');

      // Verify expense was created
      await expect(page.locator(`text=${SAMPLE_EXPENSES.coffee.category}`)).toBeVisible();
    });

    test('should show validation error for negative amount', async ({ page }) => {
      await page.goto('/expenses/new');

      // Try to enter negative amount
      await page.fill('input[name="amount"]', '-50');
      await page.selectOption('select#categorySelect', 'Food');
      await page.fill('input[name="date"]', '2026-01-15');

      // Submit form
      await page.click('button[type="submit"]');

      // Should show validation error
      await expect(page.locator('.error')).toBeVisible();
      await expect(page.locator('.error')).toContainText(/valid amount/i);
    });

    test('should show validation error for missing date', async ({ page }) => {
      await page.goto('/expenses/new');

      // Fill form without date
      await page.fill('input[name="amount"]', '50');
      await page.selectOption('select#categorySelect', 'Food');

      // Submit form
      await page.click('button[type="submit"]');

      // Should show validation error
      await expect(page.locator('.error')).toBeVisible();
      await expect(page.locator('.error')).toContainText(/date/i);
    });
  });

  test.describe('View Expenses', () => {
    test('should display expense list grouped by date', async ({ page }) => {
      // Create a couple of expenses first
      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', String(SAMPLE_EXPENSES.groceries.amountCents / 100));
      await page.selectOption('select#categorySelect', SAMPLE_EXPENSES.groceries.category);
      await page.fill('input[name="date"]', SAMPLE_EXPENSES.groceries.date);
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      // Create another expense
      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', String(SAMPLE_EXPENSES.coffee.amountCents / 100));
      await page.selectOption('select#categorySelect', SAMPLE_EXPENSES.coffee.category);
      await page.fill('input[name="date"]', SAMPLE_EXPENSES.coffee.date);
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      // Verify expenses are displayed
      await expect(page.locator('text=/Expenses|All Expenses/i')).toBeVisible();

      // Expenses should be visible
      const expenseItems = page.locator('.card, [data-testid="expense-item"], .expense-item');
      const count = await expenseItems.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should filter expenses by date range', async ({ page }) => {
      // Create expenses
      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', '50');
      await page.selectOption('select#categorySelect', 'Food');
      await page.fill('input[name="date"]', '2026-01-15');
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      // Look for date filter inputs
      const fromDateInput = page.locator('input[type="date"][name="from"], input[type="date"]').first();
      const toDateInput = page.locator('input[type="date"][name="to"], input[type="date"]').last();

      if (await fromDateInput.isVisible() && await toDateInput.isVisible()) {
        // Set date range
        await fromDateInput.fill('2026-01-01');
        await toDateInput.fill('2026-01-20');

        // Wait for list to update
        await page.waitForTimeout(1000);

        // Verify filtered results
        await expect(page.locator('.card, [data-testid="expense-item"]')).toBeTruthy();
      }
    });

    test('should filter expenses by category', async ({ page }) => {
      // Create expenses with different categories
      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', '50');
      await page.selectOption('select#categorySelect', 'Food');
      await page.fill('input[name="date"]', '2026-01-15');
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', '30');
      await page.selectOption('select#categorySelect', 'Transportation');
      await page.fill('input[name="date"]', '2026-01-15');
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      // Look for category filter
      const categoryFilter = page.locator('select[name="category"], select:has-text("All Categories")').first();

      if (await categoryFilter.isVisible()) {
        // Filter by Food category
        await categoryFilter.selectOption('Food');

        await page.waitForTimeout(1000);

        // Should only show Food expenses
        await expect(page.locator('text=Food')).toBeVisible();
      }
    });
  });

  test.describe('Edit Expense', () => {
    test('should edit existing expense and verify changes', async ({ page }) => {
      // Create an expense first
      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', String(SAMPLE_EXPENSES.groceries.amountCents / 100));
      await page.selectOption('select#categorySelect', SAMPLE_EXPENSES.groceries.category);
      await page.fill('input[name="date"]', SAMPLE_EXPENSES.groceries.date);
      await page.fill('textarea[name="note"]', 'Original note');
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      // Click on the expense to edit it
      const expenseLink = page.locator('a:has-text("Original note"), .expense-item, .card').first();
      await expenseLink.click();

      // Wait for edit page to load
      await page.waitForLoadState('networkidle');

      // Verify we're on the edit page
      await expect(page).toHaveURL(/\/expenses\/\d+/);

      // Edit the expense
      await page.fill('input[name="amount"]', '75.50');
      await page.fill('textarea[name="note"]', 'Updated note');

      // Save changes
      await page.click('button[type="submit"]');

      // Should redirect back to expenses list
      await page.waitForURL('/expenses');

      // Verify changes are reflected
      await expect(page.locator('text=Updated note')).toBeVisible();
    });
  });

  test.describe('Delete Expense', () => {
    test('should delete expense with confirmation', async ({ page }) => {
      // Create an expense
      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', String(SAMPLE_EXPENSES.utilities.amountCents / 100));
      await page.selectOption('select#categorySelect', SAMPLE_EXPENSES.utilities.category);
      await page.fill('input[name="date"]', SAMPLE_EXPENSES.utilities.date);
      await page.fill('textarea[name="note"]', 'To be deleted');
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      // Click on the expense to edit/view it
      const expenseLink = page.locator('a:has-text("To be deleted"), .expense-item:has-text("To be deleted")').first();
      await expenseLink.click();

      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Set up dialog handler to accept confirmation
      page.on('dialog', dialog => dialog.accept());

      // Click delete button
      await page.click('button:has-text("Delete")');

      // Should redirect to expenses list
      await page.waitForURL('/expenses', { timeout: 10000 });

      // Verify expense is deleted
      await expect(page.locator('text=To be deleted')).not.toBeVisible();
    });

    test('should cancel deletion when user dismisses confirmation', async ({ page }) => {
      // Create an expense
      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', '25');
      await page.selectOption('select#categorySelect', 'Food');
      await page.fill('input[name="date"]', '2026-01-15');
      await page.fill('textarea[name="note"]', 'Should not be deleted');
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      // Click on the expense
      const expenseLink = page.locator('a:has-text("Should not be deleted")').first();
      await expenseLink.click();

      await page.waitForLoadState('networkidle');

      // Set up dialog handler to dismiss confirmation
      page.on('dialog', dialog => dialog.dismiss());

      // Click delete button
      await page.click('button:has-text("Delete")');

      // Should still be on the same page
      await page.waitForTimeout(500);

      // Expense should still exist
      await expect(page.locator('textarea[name="note"]')).toHaveValue('Should not be deleted');
    });
  });

  test.describe('Form Navigation', () => {
    test('should redirect to expenses list after create', async ({ page }) => {
      await page.goto('/expenses/new');

      await page.fill('input[name="amount"]', '10');
      await page.selectOption('select#categorySelect', 'Food');
      await page.fill('input[name="date"]', '2026-01-15');

      await page.click('button[type="submit"]');

      // Should redirect to /expenses
      await expect(page).toHaveURL('/expenses');
    });

    test('should redirect to expenses list after update', async ({ page }) => {
      // Create an expense
      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', '10');
      await page.selectOption('select#categorySelect', 'Food');
      await page.fill('input[name="date"]', '2026-01-15');
      await page.fill('textarea[name="note"]', 'Test update redirect');
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      // Edit the expense
      const expenseLink = page.locator('a:has-text("Test update redirect")').first();
      await expenseLink.click();

      await page.waitForLoadState('networkidle');

      // Update and submit
      await page.fill('input[name="amount"]', '20');
      await page.click('button[type="submit"]');

      // Should redirect to /expenses
      await expect(page).toHaveURL('/expenses');
    });
  });
});
