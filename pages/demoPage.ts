import { Page, expect } from '@playwright/test';

export class DemoPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigate to the Get a Demo page
  async goto() {
    await this.page.goto('https://www.invicti.com/get-demo');
  }

  // Step 1: Fill in the Work Email field and proceed
  async fillEmail(email: string) {
    await this.page.getByRole('textbox', { name: 'Work Email*' }).fill(email);
    await expect(this.page.getByRole('textbox', { name: 'Work Email*' })).toHaveValue(email);
    await this.page.getByRole('link', { name: 'Next →' }).click();
  }

  // Step 2: Fill in First Name, Last Name, Company and proceed
  async fillPersonalDetails(firstName: string, lastName: string, company: string) {
    await this.page.getByRole('textbox', { name: 'First Name*' }).fill(firstName);
    await expect(this.page.getByRole('textbox', { name: 'First Name*' })).toHaveValue(firstName);

    await this.page.getByRole('textbox', { name: 'Last Name*' }).fill(lastName);
    await expect(this.page.getByRole('textbox', { name: 'Last Name*' })).toHaveValue(lastName);

    await this.page.getByRole('textbox', { name: 'Company*' }).fill(company);
    await expect(this.page.getByRole('textbox', { name: 'Company*' })).toHaveValue(company);

    await this.page.getByRole('link', { name: 'Next →' }).click();
  }

  // Step 3: Fill in Telephone and check the consent checkbox
  async fillContactDetails(telephone: string) {
    await this.page.getByRole('textbox', { name: 'Telephone*' }).fill(telephone);
    await expect(this.page.getByRole('textbox', { name: 'Telephone*' })).toHaveValue(telephone);

    await this.page.locator('.w-checkbox-input').click();
    await expect(this.page.locator('.w-checkbox-input')).toBeChecked();
  }
}
