import { test } from '@playwright/test';
import { DemoPage } from '../pages/demoPage';

test.describe('Invicti - Get a Demo page', () => {
  test('should fill in the multi-step demo request form and validate all inputs', async ({ page }) => {

    const demoPage = new DemoPage(page);

    // Navigate to the Get a Demo page
    await demoPage.goto();

    // Step 1: Fill in the Work Email field
    await demoPage.fillEmail('christine.nyambwari@invicti.com');

    // Step 2: Fill in First Name, Last Name, and Company
    await demoPage.fillPersonalDetails('Christine', 'Nyambwari', 'Invicti');

    // Step 3: Fill in Telephone and check the consent checkbox
    await demoPage.fillContactDetails('254795558637');

  });
});