import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { request as playwrightRequest } from '@playwright/test';

let responseStatus: number;
let responseBody: any;
let credentials: any;

Given('I have valid login credentials', async (dataTable) => {
  credentials = dataTable.rowsHash();
  console.log('Valid credentials set:', credentials.username);
});

Given('I have invalid login credentials', async (dataTable) => {
  credentials = dataTable.rowsHash();
  console.log('Invalid credentials set:', credentials.username);
});

When('I send a POST request to {string} with my credentials', async function (url) {
  const request = await playwrightRequest.newContext();

  const response = await request.post(url, {
    data: {
      username: credentials.username,
      password: credentials.password
    },
    headers: { 'Content-Type': 'application/json' }
  });

  this.statusCode = response.status();  
  responseBody = await response.json();

  console.log('Response Status:', this.statusCode);
  console.log('Response Body:', JSON.stringify(responseBody, null, 2));
});

Then('the response should contain an access token', async () => {
  expect(responseBody).toHaveProperty('accessToken');
  expect(responseBody.accessToken).toBeTruthy();
  console.log('✓ Access token present');
});

Then('the response should contain user information', async () => {
  const props = ['id', 'username', 'email', 'firstName', 'lastName'];
  props.forEach(prop => {
    expect(responseBody).toHaveProperty(prop);
  });
  console.log('✓ User information present');
  console.log(`  User: ${responseBody.firstName} ${responseBody.lastName}`);
});

Then('the response should contain an error message', async () => {
  expect(responseBody.message || responseBody.error).toBeTruthy();
  console.log('✓ Error message present:', responseBody.message || responseBody.error);
});