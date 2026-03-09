import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';


test.describe('Login Slow Motion & Video Demo', () => {

  // Successful login recorded as video
  test('should record successful login video @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.verifyLoginPageLoaded();
    await loginPage.login('kimri21@gmail.com', 'stine6892');
    await loginPage.verifySuccessfulLogin();
  });

  // Failed login recorded as video
  test('should record failed login video @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('wrong@email.com', 'wrongpassword');
    await loginPage.verifyFailedLogin();
  });

  // Navigation flow recorded as video
  test('should record navigation to forgot password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.clickForgotPassword();
    await expect(page).toHaveURL(/.*\/forgot-password/);
  });

});