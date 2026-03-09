import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Loginpage';


test.describe('Login Annotations Demo', () => {

  // @smoke - critical tests that always run
  test('should load login page @smoke', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('Welcome back!')).toBeVisible();
  });

  // @regression - full suite tests
 test('should login successfully @regression', async ({ page }) => {
    test.setTimeout(60000); //  60 seconds 
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('kimri21@gmail.com', 'stine6892');
    await loginPage.verifySuccessfulLogin();
  });

  // test.skip() - skips this test entirely
  test('should skip this test', async ({ page }) => {
    test.skip(true, 'Skipping - feature not yet implemented');
    await page.goto('/login');
  });

  // test.fixme() - marks test as broken, needs fixing
  test('should be fixed later', async ({ page }) => {
    test.fixme(true, 'This test is broken - needs investigation');
    await page.goto('/login');
  });

  // test.slow() - gives the test 3x the normal timeout
  test('should handle slow network @slow', async ({ page }) => {
    test.slow();
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.verifyLoginPageLoaded();
  });

  // test.fail(), marks test as expected to fail
  // useful when you know a bug exists and want to track it
  test('should fail as expected - known bug', async ({ page }) => {
    test.fail(true, 'Known bug - error message disappears too fast');
    await page.goto('/login');
    const loginPage = new LoginPage(page);
    await loginPage.login('wrong@email.com', 'wrongpassword');
    await expect(page.getByText('Login failed')).toBeVisible({ timeout: 1000 });
  });

});