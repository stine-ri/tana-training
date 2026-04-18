import { test, expect } from '@playwright/test';

test.describe('Invicti - Get a Demo page', () => {
  test('should fill in the multi-step demo request form and validate all inputs', async ({ page }) => {

    // Navigate to the Invicti Get a Demo page
    await page.goto('https://www.invicti.com/get-demo');

    // ── STEP 1: Work Email ──────────────────────────────────────────────

    // Fill in the Work Email field
    await page.getByRole('textbox', { name: 'Work Email*' }).fill('christine.nyambwari@invicti.com');

    // Assert the Work Email field contains the expected value
    await expect(page.getByRole('textbox', { name: 'Work Email*' })).toHaveValue('christine.nyambwari@invicti.com');

    // Click Next to proceed to step 2
    await page.getByRole('link', { name: 'Next →' }).click();

    // ── STEP 2: First Name, Last Name, Company ──────────────────────────

    // Fill in the First Name field
    await page.getByRole('textbox', { name: 'First Name*' }).fill('Christine');

    // Assert the First Name field contains the expected value
    await expect(page.getByRole('textbox', { name: 'First Name*' })).toHaveValue('Christine');

    // Fill in the Last Name field
    await page.getByRole('textbox', { name: 'Last Name*' }).fill('Nyambwari');

    // Assert the Last Name field contains the expected value
    await expect(page.getByRole('textbox', { name: 'Last Name*' })).toHaveValue('Nyambwari');

    // Fill in the Company field
    await page.getByRole('textbox', { name: 'Company*' }).fill('Invicti');

    // Assert the Company field contains the expected value
    await expect(page.getByRole('textbox', { name: 'Company*' })).toHaveValue('Invicti');

    // Click Next to proceed to step 3
    await page.getByRole('link', { name: 'Next →' }).click();

    // ── STEP 3: Telephone + checkbox ───────────────────────────────────

    // Fill in the Telephone field
    await page.getByRole('textbox', { name: 'Telephone*' }).fill('254705912632');

    // Assert the Telephone field contains the expected value
    await expect(page.getByRole('textbox', { name: 'Telephone*' })).toHaveValue('254705912632');

    // Check the consent/terms checkbox
    await page.locator('.w-checkbox-input').click();

    // Assert the checkbox is checked
    await expect(page.locator('.w-checkbox-input')).toBeChecked();

  });
});