import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  // Navigation 
  async goto() {
    await this.page.goto('/login');
  }

  //  Locators 
  emailInput() {
    return this.page.getByLabel('email');
  }

  passwordInput() {
    return this.page.locator('#password');
  }

  signInButton() {
    return this.page.getByRole('button', { name: 'Sign In' });
  }

  forgotPasswordButton() {
    return this.page.getByRole('button', { name: 'Forgot your password?' });
  }

  welcomeText() {
    return this.page.getByText('Welcome back!');
  }

  helpBox() {
    return this.page.getByText('Need help signing in?');
  }

  // Actions 
  async login(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.signInButton().click();
  }

  async clickForgotPassword() {
    await this.forgotPasswordButton().click();
  }

  async clickCreateAccount() {
    await this.page.goto('/register');
  }

  //  Assertions 
  async verifyLoginPageLoaded() {
    await expect(this.welcomeText()).toBeVisible();
  }

  async verifySuccessfulLogin() {
    await this.page.waitForURL('**/client/dashboard');
    await expect(this.page).toHaveURL(/.*\/client\/dashboard/);
    await expect(this.page.getByText('My Service Requests')).toBeVisible();
  }

  async verifyFailedLogin() {
    await expect(this.emailInput()).toHaveValue('', { timeout: 10000 });
    await expect(this.passwordInput()).toHaveValue('');
    await expect(this.helpBox()).toBeVisible();
  }
}