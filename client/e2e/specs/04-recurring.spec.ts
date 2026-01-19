import { test, expect } from '@playwright/test';
import { SAMPLE_RECURRING_EXPENSES } from '../fixtures/test-data';

test.describe('Recurring Expenses', () => {
  test.describe('Create Recurring Expense', () => {
    test('should create daily recurring expense', async ({ page }) => {
      await page.goto('/recurring');

      // Click button to show form
      await page.click('button:has-text("New Recurring"), button:has-text("Add Recurring"), button:has-text("Create")');

      // Wait for form to appear
      await page.waitForSelector('form', { timeout: 5000 });

      // Fill in the form
      await page.fill('input[name="amount"]', String(SAMPLE_RECURRING_EXPENSES.daily.amountCents / 100));
      await page.selectOption('select[name="category"]', SAMPLE_RECURRING_EXPENSES.daily.category);
      await page.fill('input[name="note"]', SAMPLE_RECURRING_EXPENSES.daily.note || '');

      // Select frequency
      await page.selectOption('select[name="frequency"]', SAMPLE_RECURRING_EXPENSES.daily.frequency);

      // Set next date
      await page.fill('input[name="nextDate"]', SAMPLE_RECURRING_EXPENSES.daily.nextDate);

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for success message or list to update
      await page.waitForTimeout(1000);

      // Verify recurring expense appears in list
      await expect(page.locator(`text=${SAMPLE_RECURRING_EXPENSES.daily.note}`)).toBeVisible();
    });

    test('should create weekly recurring expense', async ({ page }) => {
      await page.goto('/recurring');

      // Show form
      await page.click('button:has-text("New Recurring"), button:has-text("Add Recurring"), button:has-text("Create")');

      await page.waitForSelector('form');

      // Fill form
      await page.fill('input[name="amount"]', String(SAMPLE_RECURRING_EXPENSES.weekly.amountCents / 100));
      await page.selectOption('select[name="category"]', SAMPLE_RECURRING_EXPENSES.weekly.category);
      await page.fill('input[name="note"]', SAMPLE_RECURRING_EXPENSES.weekly.note || '');

      // Select frequency
      await page.selectOption('select[name="frequency"]', SAMPLE_RECURRING_EXPENSES.weekly.frequency);

      // Set day of week (1 = Monday)
      if (SAMPLE_RECURRING_EXPENSES.weekly.dayOfWeek !== undefined) {
        const dayOfWeekInput = page.locator('select[name="dayOfWeek"], input[name="dayOfWeek"]').first();
        if (await dayOfWeekInput.isVisible()) {
          await dayOfWeekInput.fill(String(SAMPLE_RECURRING_EXPENSES.weekly.dayOfWeek));
        }
      }

      await page.fill('input[name="nextDate"]', SAMPLE_RECURRING_EXPENSES.weekly.nextDate);

      await page.click('button[type="submit"]');

      await page.waitForTimeout(1000);

      await expect(page.locator(`text=${SAMPLE_RECURRING_EXPENSES.weekly.note}`)).toBeVisible();
    });

    test('should create monthly recurring expense', async ({ page }) => {
      await page.goto('/recurring');

      await page.click('button:has-text("New Recurring"), button:has-text("Add Recurring"), button:has-text("Create")');

      await page.waitForSelector('form');

      await page.fill('input[name="amount"]', String(SAMPLE_RECURRING_EXPENSES.monthly.amountCents / 100));
      await page.selectOption('select[name="category"]', SAMPLE_RECURRING_EXPENSES.monthly.category);
      await page.fill('input[name="note"]', SAMPLE_RECURRING_EXPENSES.monthly.note || '');

      // Select frequency
      await page.selectOption('select[name="frequency"]', SAMPLE_RECURRING_EXPENSES.monthly.frequency);

      // Set day of month
      if (SAMPLE_RECURRING_EXPENSES.monthly.dayOfMonth !== undefined) {
        const dayOfMonthInput = page.locator('select[name="dayOfMonth"], input[name="dayOfMonth"]').first();
        if (await dayOfMonthInput.isVisible()) {
          await dayOfMonthInput.fill(String(SAMPLE_RECURRING_EXPENSES.monthly.dayOfMonth));
        }
      }

      await page.fill('input[name="nextDate"]', SAMPLE_RECURRING_EXPENSES.monthly.nextDate);

      await page.click('button[type="submit"]');

      await page.waitForTimeout(1000);

      await expect(page.locator(`text=${SAMPLE_RECURRING_EXPENSES.monthly.note}`)).toBeVisible();
    });

    test('should create yearly recurring expense', async ({ page }) => {
      await page.goto('/recurring');

      await page.click('button:has-text("New Recurring"), button:has-text("Add Recurring"), button:has-text("Create")');

      await page.waitForSelector('form');

      await page.fill('input[name="amount"]', String(SAMPLE_RECURRING_EXPENSES.yearly.amountCents / 100));
      await page.selectOption('select[name="category"]', SAMPLE_RECURRING_EXPENSES.yearly.category);
      await page.fill('input[name="note"]', SAMPLE_RECURRING_EXPENSES.yearly.note || '');

      // Select frequency
      await page.selectOption('select[name="frequency"]', SAMPLE_RECURRING_EXPENSES.yearly.frequency);

      // Set day of month and month of year
      if (SAMPLE_RECURRING_EXPENSES.yearly.dayOfMonth !== undefined) {
        const dayOfMonthInput = page.locator('select[name="dayOfMonth"], input[name="dayOfMonth"]').first();
        if (await dayOfMonthInput.isVisible()) {
          await dayOfMonthInput.fill(String(SAMPLE_RECURRING_EXPENSES.yearly.dayOfMonth));
        }
      }

      if (SAMPLE_RECURRING_EXPENSES.yearly.monthOfYear !== undefined) {
        const monthOfYearInput = page.locator('select[name="monthOfYear"], input[name="monthOfYear"]').first();
        if (await monthOfYearInput.isVisible()) {
          await monthOfYearInput.fill(String(SAMPLE_RECURRING_EXPENSES.yearly.monthOfYear));
        }
      }

      await page.fill('input[name="nextDate"]', SAMPLE_RECURRING_EXPENSES.yearly.nextDate);

      await page.click('button[type="submit"]');

      await page.waitForTimeout(1000);

      await expect(page.locator(`text=${SAMPLE_RECURRING_EXPENSES.yearly.note}`)).toBeVisible();
    });
  });

  test.describe('Edit Recurring Expense', () => {
    test('should edit existing recurring expense', async ({ page }) => {
      // Create a recurring expense first
      await page.goto('/recurring');

      await page.click('button:has-text("New Recurring"), button:has-text("Add Recurring"), button:has-text("Create")');

      await page.waitForSelector('form');

      await page.fill('input[name="amount"]', '10');
      await page.selectOption('select[name="category"]', 'Food');
      await page.fill('input[name="note"]', 'Original recurring note');
      await page.selectOption('select[name="frequency"]', 'daily');
      await page.fill('input[name="nextDate"]', '2026-01-20');

      await page.click('button[type="submit"]');

      await page.waitForTimeout(1000);

      // Find and click edit button
      const editButton = page.locator('button:has-text("Edit")').first();
      await editButton.click();

      // Wait for form to populate
      await page.waitForTimeout(500);

      // Edit the fields
      await page.fill('input[name="amount"]', '15');
      await page.fill('input[name="note"]', 'Updated recurring note');

      // Submit changes
      await page.click('button[type="submit"]');

      await page.waitForTimeout(1000);

      // Verify changes
      await expect(page.locator('text=Updated recurring note')).toBeVisible();
    });
  });

  test.describe('Delete Recurring Expense', () => {
    test('should delete recurring expense', async ({ page }) => {
      // Create a recurring expense
      await page.goto('/recurring');

      await page.click('button:has-text("New Recurring"), button:has-text("Add Recurring"), button:has-text("Create")');

      await page.waitForSelector('form');

      await page.fill('input[name="amount"]', '25');
      await page.selectOption('select[name="category"]', 'Entertainment');
      await page.fill('input[name="note"]', 'To be deleted recurring');
      await page.selectOption('select[name="frequency"]', 'monthly');
      await page.fill('input[name="nextDate"]', '2026-02-01');

      await page.click('button[type="submit"]');

      await page.waitForTimeout(1000);

      // Set up dialog handler
      page.on('dialog', dialog => dialog.accept());

      // Find and click delete button
      const deleteButton = page.locator('button:has-text("Delete")').first();
      await deleteButton.click();

      await page.waitForTimeout(1000);

      // Verify it's deleted
      await expect(page.locator('text=To be deleted recurring')).not.toBeVisible();
    });
  });

  test.describe('Process Recurring Expenses', () => {
    test('should process recurring expenses manually', async ({ page }) => {
      // Create a recurring expense with a past date
      await page.goto('/recurring');

      await page.click('button:has-text("New Recurring"), button:has-text("Add Recurring"), button:has-text("Create")');

      await page.waitForSelector('form');

      await page.fill('input[name="amount"]', '30');
      await page.selectOption('select[name="category"]', 'Utilities');
      await page.fill('input[name="note"]', 'Process me');
      await page.selectOption('select[name="frequency"]', 'daily');
      // Set a past date so it will be processed
      await page.fill('input[name="nextDate"]', '2026-01-01');

      await page.click('button[type="submit"]');

      await page.waitForTimeout(1000);

      // Look for process button
      const processButton = page.locator('button:has-text("Process"), button:has-text("Run Now")').first();

      if (await processButton.isVisible()) {
        await processButton.click();

        // Wait for processing to complete
        await page.waitForTimeout(2000);

        // Should see success message
        await expect(page.locator('text=/Processed|Created|Success/i')).toBeVisible();
      }
    });
  });

  test.describe('Recurring Expense List', () => {
    test('should display list of recurring expenses', async ({ page }) => {
      // Create a couple of recurring expenses
      await page.goto('/recurring');

      // First expense
      await page.click('button:has-text("New Recurring"), button:has-text("Add Recurring"), button:has-text("Create")');
      await page.waitForSelector('form');
      await page.fill('input[name="amount"]', '10');
      await page.selectOption('select[name="category"]', 'Food');
      await page.fill('input[name="note"]', 'Recurring 1');
      await page.selectOption('select[name="frequency"]', 'daily');
      await page.fill('input[name="nextDate"]', '2026-01-20');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);

      // Second expense
      await page.click('button:has-text("New Recurring"), button:has-text("Add Recurring"), button:has-text("Create")');
      await page.waitForSelector('form');
      await page.fill('input[name="amount"]', '20');
      await page.selectOption('select[name="category"]', 'Entertainment');
      await page.fill('input[name="note"]', 'Recurring 2');
      await page.selectOption('select[name="frequency"]', 'monthly');
      await page.fill('input[name="nextDate"]', '2026-02-01');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);

      // Verify both are in the list
      await expect(page.locator('text=Recurring 1')).toBeVisible();
      await expect(page.locator('text=Recurring 2')).toBeVisible();
    });

    test('should cancel form without creating recurring expense', async ({ page }) => {
      await page.goto('/recurring');

      // Show form
      await page.click('button:has-text("New Recurring"), button:has-text("Add Recurring"), button:has-text("Create")');

      await page.waitForSelector('form');

      // Start filling form
      await page.fill('input[name="amount"]', '50');

      // Click cancel
      const cancelButton = page.locator('button:has-text("Cancel")').first();
      if (await cancelButton.isVisible()) {
        await cancelButton.click();

        // Form should be hidden
        await expect(page.locator('form')).not.toBeVisible();
      }
    });
  });
});
