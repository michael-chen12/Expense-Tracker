import { chromium, FullConfig } from '@playwright/test';
import { execSync } from 'child_process';
import path from 'path';
import { cleanTestUserData, verifyTestUser } from './helpers/db-cleanup';
import { TEST_USER } from './fixtures/test-data';

const authFile = path.join(__dirname, '.auth', 'user.json');

async function globalSetup(config: FullConfig) {
  console.log('\n🚀 Running global setup for E2E tests...\n');

  try {
    // Step 1: Clean test user data
    console.log('Step 1: Cleaning test user data');
    await cleanTestUserData();
    console.log('');

    // Step 2: Seed E2E test user
    console.log('Step 2: Seeding E2E test user');
    try {
      execSync('cd ../server && npm run seed:e2e-user', {
        stdio: 'inherit',
        cwd: __dirname
      });
    } catch (error) {
      console.error('Failed to seed E2E test user. Make sure the server directory exists and npm is configured.');
      throw error;
    }
    console.log('');

    // Step 3: Verify test user exists
    console.log('Step 3: Verifying test user');
    await verifyTestUser();
    console.log('');

    // Step 4: Authenticate and save session
    console.log('Step 4: Authenticating and saving session state');
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Navigate to login page
      console.log(`  → Navigating to ${baseURL}/login`);
      await page.goto(`${baseURL}/login`);

      // Wait for the page to load
      await page.waitForLoadState('networkidle');

      // Fill in login credentials
      console.log('  → Filling in credentials');
      await page.fill('input[name="email"]', TEST_USER.email);
      await page.fill('input[name="password"]', TEST_USER.password);

      // Submit the form
      console.log('  → Submitting login form');
      await page.click('button[type="submit"]');

      // Wait for navigation to dashboard
      console.log('  → Waiting for redirect to dashboard');
      await page.waitForURL('/', { timeout: 15000 });

      // Verify we're logged in by checking for user-specific content
      await page.waitForSelector('text=/Expense Tracker|Dashboard|Recent Expenses/i', { timeout: 5000 });

      console.log('  → Login successful!');

      // Save signed-in state
      await context.storageState({ path: authFile });
      console.log(`  → Auth state saved to ${authFile}`);
    } catch (error) {
      console.error('  ❌ Authentication failed:', error);

      // Take a screenshot for debugging
      await page.screenshot({ path: 'e2e/global-setup-error.png', fullPage: true });
      console.log('  → Screenshot saved to e2e/global-setup-error.png');

      throw error;
    } finally {
      await browser.close();
    }

    console.log('\n✅ Global setup completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Global setup failed:', error);
    throw error;
  }
}

export default globalSetup;
