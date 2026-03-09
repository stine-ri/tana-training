import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';

//  login flow using Page Object Model

test.describe('Login Tests @smoke', () => {

  // Runs before every test - no need to repeat page.goto()
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.verifyLoginPageLoaded();
  });

  // Test 1 - Successful login
  test('should login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('kimri21@gmail.com', 'stine6892');
    await loginPage.verifySuccessfulLogin();
  });

  // Test 2 - Failed login
  test('should show error with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('wrong@email.com', 'wrongpassword');
    await loginPage.verifyFailedLogin();
  });

  // Test 3 - Navigate to create account
  test('should navigate to create account page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.clickCreateAccount();
    await expect(page).toHaveURL(/.*\/register/);
  });

  // Test 4 - Navigate to forgot password
  test('should navigate to forgot password page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.clickForgotPassword();
    await expect(page).toHaveURL(/.*\/forgot-password/);
  });

});