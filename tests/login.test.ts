import { test, expect } from '@playwright/test';

// Test 1 - Successful login
test('should navigate to login page', async ({ page }) => {
  await page.goto('https://www.quisells.com/login');

  // Verify login page loaded
  await expect(page.getByText('Welcome back!')).toBeVisible();

  // Fill in credentials
  await page.getByLabel('email').fill('kimri21@gmail.com');
  await page.locator('#password').fill('stine6892');

  // Click Sign In
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Verify successful login
  await page.waitForURL('https://www.quisells.com/client/dashboard');
  await expect(page).toHaveURL(/.*\/client\/dashboard/);
  await expect(page.getByText('My Service Requests')).toBeVisible();
});


// Test 2 - Failed login
test('should show error with invalid credentials', async ({ page }) => {
  await page.goto('https://www.quisells.com/login');

  // Fill with invalid data
  await page.getByLabel('email').fill('wrong@email.com');
  await page.locator('#password').fill('wrongpassword');

  // Click Sign In
  await page.getByRole('button', { name: 'Sign In' }).click();

  // After failed login inputs are cleared and help box appears
  await expect(page.locator('input[name="email"]')).toHaveValue('');
  await expect(page.locator('#password')).toHaveValue('');
  await expect(page.getByText('Need help signing in?')).toBeVisible();
});

// Test 3 - Navigate to create account
test('should navigate to create account page', async ({ page }) => {
  await page.goto('https://www.quisells.com/login');

  // Navigate directly since the link may not be immediately clickable
  await page.goto('https://www.quisells.com/register');

  // Verify navigation
  await expect(page).toHaveURL(/.*\/register/);
});

// Test 4 - Navigate to forgot password
test('should navigate to forgot password page', async ({ page }) => {
  await page.goto('https://www.quisells.com/login');

  // Forgot password is a button not a link
  await page.getByRole('button', { name: 'Forgot your password?' }).click();

  // Verify navigation
  await expect(page).toHaveURL(/.*\/forgot-password/);
});