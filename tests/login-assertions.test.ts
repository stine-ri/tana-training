import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';

//assertions

test.describe('Login Assertions @regression', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  // Check page URL
  test('should have correct URL', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/login/);
  });

  // Check page title
  test('should have correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Quisells/);
  });

  // Check element is visible
  test('should show welcome text', async ({ page }) => {
    await expect(page.getByText('Welcome back!')).toBeVisible();
  });

  // Check element is enabled
  test('should have enabled sign in button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeEnabled();
  });

  // Check input is visible
  test('should have email input visible', async ({ page }) => {
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  // Check input value after typing
  test('should fill email input correctly', async ({ page }) => {
    await page.getByLabel('email').fill('test@gmail.com');
    await expect(page.getByLabel('email')).toHaveValue('test@gmail.com');
  });

  // Check element is hidden before failed login
   test('should hide help box before login attempt', async ({ page }) => {
    await expect(page.getByText('Need help signing in?')).toBeVisible(); 
  });

  // Check help box appears after failed login
  test('should show help box after failed login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('wrong@email.com', 'wrongpassword');
    await expect(page.getByText('Need help signing in?')).toBeVisible({ timeout: 10000 });
  });

});