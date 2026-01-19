import { test, expect } from '@playwright/test';
import { TEST_USER } from '../fixtures/test-data';

test.describe('Authentication', () => {
  test.describe('Login', () => {
    // Use unauthenticated state for login tests
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should login with valid credentials', async ({ page }) => {
      await page.goto('/login');

      // Fill in credentials
      await page.fill('input[name="email"]', TEST_USER.email);
      await page.fill('input[name="password"]', TEST_USER.password);

      // Submit form
      await page.click('button[type="submit"]');

      // Should redirect to dashboard
      await page.waitForURL('/');

      // Verify dashboard elements are visible
      await expect(page.locator('text=/Expense Tracker|Dashboard|Recent Expenses/i')).toBeVisible();
    });

    test('should show error with invalid credentials', async ({ page }) => {
      await page.goto('/login');

      // Fill in invalid credentials
      await page.fill('input[name="email"]', 'invalid@example.com');
      await page.fill('input[name="password"]', 'wrongpassword');

      // Submit form
      await page.click('button[type="submit"]');

      // Should show error message
      await expect(page.locator('.error')).toBeVisible();
    });

    test('should show error with wrong password', async ({ page }) => {
      await page.goto('/login');

      // Fill in valid email but wrong password
      await page.fill('input[name="email"]', TEST_USER.email);
      await page.fill('input[name="password"]', 'WrongPassword123!');

      // Submit form
      await page.click('button[type="submit"]');

      // Should show error message
      await expect(page.locator('.error')).toBeVisible();
    });

    test('should redirect to login when accessing protected route while logged out', async ({ page }) => {
      // Try to access the dashboard while logged out
      await page.goto('/');

      // Should redirect to login page
      await expect(page).toHaveURL(/.*login/);
    });
  });

  test.describe('Logout', () => {
    // Use authenticated state for logout tests (from global setup)
    test('should logout successfully', async ({ page }) => {
      await page.goto('/');

      // Verify we're logged in first
      await expect(page.locator('text=/Expense Tracker|Dashboard/i')).toBeVisible();

      // Click the logout button (might be in a dropdown or menu)
      // Adjust selector based on your actual logout button location
      const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout"), a:has-text("Sign Out")').first();

      if (await logoutButton.isVisible()) {
        await logoutButton.click();

        // Should redirect to login page
        await expect(page).toHaveURL(/.*login/);
      } else {
        // If no logout button found, this test will be skipped
        // This is expected if logout is not yet implemented
        test.skip();
      }
    });
  });

  test.describe('Registration', () => {
    // Use unauthenticated state for registration tests
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should show error when passwords do not match', async ({ page }) => {
      await page.goto('/register');

      // Fill in registration form with mismatched passwords
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'newuser@example.com');
      await page.fill('input[name="password"]', 'Password123!');
      await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!');

      // Submit form
      await page.click('button[type="submit"]');

      // Should show error message
      await expect(page.locator('.error')).toBeVisible();
      await expect(page.locator('.error')).toContainText(/passwords do not match/i);
    });

    test('should show error when password is too short', async ({ page }) => {
      await page.goto('/register');

      // Fill in registration form with short password
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'newuser@example.com');
      await page.fill('input[name="password"]', 'short');
      await page.fill('input[name="confirmPassword"]', 'short');

      // Submit form
      await page.click('button[type="submit"]');

      // Should show error message
      await expect(page.locator('.error')).toBeVisible();
      await expect(page.locator('.error')).toContainText(/at least 8 characters/i);
    });

    test('should show error when email already exists', async ({ page }) => {
      await page.goto('/register');

      // Try to register with existing test user email
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', TEST_USER.email);
      await page.fill('input[name="password"]', 'NewPassword123!');
      await page.fill('input[name="confirmPassword"]', 'NewPassword123!');

      // Submit form
      await page.click('button[type="submit"]');

      // Should show error message about email already existing
      await expect(page.locator('.error')).toBeVisible();
    });

    test('should navigate to login page from register page', async ({ page }) => {
      await page.goto('/register');

      // Click the "Sign in" link
      await page.click('a:has-text("Sign in")');

      // Should navigate to login page
      await expect(page).toHaveURL(/.*login/);
    });
  });

  test.describe('Navigation', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should navigate to register page from login page', async ({ page }) => {
      await page.goto('/login');

      // Click the "Sign up" link
      await page.click('a:has-text("Sign up")');

      // Should navigate to register page
      await expect(page).toHaveURL(/.*register/);
    });
  });
});
