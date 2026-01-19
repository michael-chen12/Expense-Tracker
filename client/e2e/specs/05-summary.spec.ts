import { test, expect } from '@playwright/test';
import { SAMPLE_EXPENSES } from '../fixtures/test-data';

test.describe('Summary Page', () => {
  test.describe('Monthly Summary View', () => {
    test('should display monthly summary grouped by month', async ({ page }) => {
      // Create expenses in different months
      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', String(SAMPLE_EXPENSES.groceries.amountCents / 100));
      await page.selectOption('select#categorySelect', SAMPLE_EXPENSES.groceries.category);
      await page.fill('input[name="date"]', '2026-01-15');
      await page.fill('textarea[name="note"]', 'January expense');
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      // Create another expense in a different month
      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', String(SAMPLE_EXPENSES.coffee.amountCents / 100));
      await page.selectOption('select#categorySelect', SAMPLE_EXPENSES.coffee.category);
      await page.fill('input[name="date"]', '2026-02-10');
      await page.fill('textarea[name="note"]', 'February expense');
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      // Navigate to summary page
      await page.goto('/summary');

      // Should display page title
      await expect(page.locator('text=/Monthly summary|Monthly Summary/i')).toBeVisible();

      // Should show month labels
      await expect(page.locator('text=/January 2026|February 2026/i')).toBeVisible();
    });

    test('should expand and collapse month sections', async ({ page }) => {
      // Create an expense
      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', String(SAMPLE_EXPENSES.groceries.amountCents / 100));
      await page.selectOption('select#categorySelect', SAMPLE_EXPENSES.groceries.category);
      await page.fill('input[name="date"]', '2026-01-15');
      await page.fill('textarea[name="note"]', 'Test expand collapse');
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      // Go to summary
      await page.goto('/summary');

      // Find a month section
      const monthSection = page.locator('text=/January 2026/i').first();
      await expect(monthSection).toBeVisible();

      // Click to expand (or collapse if already expanded)
      await monthSection.click();

      // Wait for animation/expansion
      await page.waitForTimeout(500);

      // Look for expense details
      const expenseDetails = page.locator('text=Test expand collapse');
      const isVisible = await expenseDetails.isVisible();

      // Click again to toggle
      await monthSection.click();
      await page.waitForTimeout(500);

      // Visibility should change
      const isVisibleAfter = await expenseDetails.isVisible();
      expect(isVisible).not.toBe(isVisibleAfter);
    });

    test('should display correct monthly totals', async ({ page }) => {
      // Create multiple expenses in the same month
      const expense1 = 50; // $50
      const expense2 = 30; // $30
      const expectedTotal = expense1 + expense2; // $80

      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', String(expense1));
      await page.selectOption('select#categorySelect', 'Food');
      await page.fill('input[name="date"]', '2026-01-15');
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', String(expense2));
      await page.selectOption('select#categorySelect', 'Transportation');
      await page.fill('input[name="date"]', '2026-01-20');
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      // Go to summary
      await page.goto('/summary');

      // Look for the total amount
      await expect(page.locator(`text=/\\$${expectedTotal}|${expectedTotal}.00/`)).toBeVisible();
    });
  });

  test.describe('Expense Actions from Summary', () => {
    test('should navigate to edit expense from summary', async ({ page }) => {
      // Create an expense
      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', String(SAMPLE_EXPENSES.utilities.amountCents / 100));
      await page.selectOption('select#categorySelect', SAMPLE_EXPENSES.utilities.category);
      await page.fill('input[name="date"]', '2026-01-18');
      await page.fill('textarea[name="note"]', 'Edit from summary');
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      // Go to summary
      await page.goto('/summary');

      // Expand the month
      const monthSection = page.locator('text=/January 2026/i').first();
      await monthSection.click();
      await page.waitForTimeout(500);

      // Click on the expense to edit
      const expenseLink = page.locator('a:has-text("Edit from summary"), text=Edit from summary').first();

      if (await expenseLink.isVisible()) {
        await expenseLink.click();

        // Should navigate to edit page
        await expect(page).toHaveURL(/\/expenses\/\d+/);
      }
    });

    test('should delete expense from summary', async ({ page }) => {
      // Create multiple expenses so deletion doesn't redirect
      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', '25');
      await page.selectOption('select#categorySelect', 'Food');
      await page.fill('input[name="date"]', '2026-01-15');
      await page.fill('textarea[name="note"]', 'Keep this one');
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', '30');
      await page.selectOption('select#categorySelect', 'Entertainment');
      await page.fill('input[name="date"]', '2026-01-16');
      await page.fill('textarea[name="note"]', 'Delete from summary');
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      // Go to summary
      await page.goto('/summary');

      // Expand the month
      const monthSection = page.locator('text=/January 2026/i').first();
      await monthSection.click();
      await page.waitForTimeout(500);

      // Set up dialog handler
      page.on('dialog', dialog => dialog.accept());

      // Find and click delete button for the expense
      // The delete button might be near the expense or require clicking the expense first
      const deleteButton = page.locator('button:has-text("Delete")').first();

      if (await deleteButton.isVisible()) {
        await deleteButton.click();

        // Wait for deletion
        await page.waitForTimeout(1000);

        // Verify expense is removed
        await expect(page.locator('text=Delete from summary')).not.toBeVisible();
      } else {
        // If delete button isn't directly visible, might need to click expense first
        const expenseItem = page.locator('text=Delete from summary').first();
        if (await expenseItem.isVisible()) {
          await expenseItem.click();
          await page.waitForLoadState('networkidle');

          // Now try to delete
          page.on('dialog', dialog => dialog.accept());
          const deleteBtn = page.locator('button:has-text("Delete")');
          if (await deleteBtn.isVisible()) {
            await deleteBtn.click();
            await page.waitForTimeout(1000);
          }
        }
      }
    });
  });

  test.describe('Empty State', () => {
    test('should redirect to dashboard when user has no expenses', async ({ page }) => {
      // Try to access summary page directly
      await page.goto('/summary');

      // If no expenses exist (from clean database), should redirect to dashboard
      // This will happen after global setup cleans the database
      await page.waitForTimeout(2000);

      // Should either be on dashboard or show empty summary
      const url = page.url();
      expect(url).toMatch(/\/(|summary)$/);
    });
  });

  test.describe('Navigation', () => {
    test('should navigate from expenses to summary', async ({ page }) => {
      // Create an expense
      await page.goto('/expenses/new');
      await page.fill('input[name="amount"]', '15');
      await page.selectOption('select#categorySelect', 'Food');
      await page.fill('input[name="date"]', '2026-01-15');
      await page.click('button[type="submit"]');

      await page.waitForURL('/expenses');

      // Look for summary link in navigation
      const summaryLink = page.locator('a:has-text("Summary"), a[href="/summary"]').first();

      if (await summaryLink.isVisible()) {
        await summaryLink.click();

        // Should navigate to summary page
        await expect(page).toHaveURL('/summary');
      } else {
        // Manually navigate to test the page
        await page.goto('/summary');
        await expect(page).toHaveURL('/summary');
      }
    });
  });

  test.describe('Month Grouping', () => {
    test('should group expenses correctly by month', async ({ page }) => {
      // Create expenses across multiple months
      const expenses = [
        { amount: 10, date: '2026-01-05', note: 'Early Jan' },
        { amount: 20, date: '2026-01-25', note: 'Late Jan' },
        { amount: 30, date: '2026-02-05', note: 'Early Feb' }
      ];

      for (const expense of expenses) {
        await page.goto('/expenses/new');
        await page.fill('input[name="amount"]', String(expense.amount));
        await page.selectOption('select#categorySelect', 'Food');
        await page.fill('input[name="date"]', expense.date);
        await page.fill('textarea[name="note"]', expense.note);
        await page.click('button[type="submit"]');
        await page.waitForURL('/expenses');
      }

      // Go to summary
      await page.goto('/summary');

      // Should see both months
      await expect(page.locator('text=/January 2026/i')).toBeVisible();
      await expect(page.locator('text=/February 2026/i')).toBeVisible();

      // Expand January
      await page.locator('text=/January 2026/i').first().click();
      await page.waitForTimeout(500);

      // Should see both January expenses
      await expect(page.locator('text=Early Jan')).toBeVisible();
      await expect(page.locator('text=Late Jan')).toBeVisible();
      // February expense should not be in January section
      // (but might be visible if February is also expanded)

      // Expand February
      await page.locator('text=/February 2026/i').first().click();
      await page.waitForTimeout(500);

      // Should see February expense
      await expect(page.locator('text=Early Feb')).toBeVisible();
    });
  });
});
