import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';

test.describe('Login Hooks Demo', () => {

  // Runs ONCE before all tests in this group
  test.beforeAll(async () => {
    console.log('--- Starting Login Test Suite ---');
  });

  // Runs before EVERY test - perfect for navigation
  test.beforeEach(async ({ page }) => {
    console.log('Navigating to login page before test...');
    await page.goto('/login');
  });

  // Runs after EVERY test - perfect for cleanup
  test.afterEach(async ({ page }) => {
    console.log('Test finished, cleaning up');
  });

  // Runs ONCE after all tests in this group
  test.afterAll(async () => {
    console.log('Login Test Suite Complete ');
  });

  test('should load login page', async ({ page }) => {
    await expect(page.getByText('Welcome back!')).toBeVisible();
  });

  test('should have sign in button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

});

// Nested groups 
test.describe('Login Nested Groups', () => {

  test.describe('Valid Credentials', () => {
    test('should login successfully', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('kimri21@gmail.com', 'stine6892');
      await loginPage.verifySuccessfulLogin();
    });
  });

  test.describe('Invalid Credentials', () => {
    test('should show error on wrong credentials', async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login('wrong@email.com', 'wrongpassword');
      await loginPage.verifyFailedLogin();
    });
  });

});