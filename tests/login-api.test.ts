import { test, expect } from '@playwright/test';

test.describe('Login API Tests @api', () => {

  // Test 1 - Check login page loads (GET request)
  test('should return 200 on login page', async ({ request }) => {
    const response = await request.get('https://www.quisells.com/login');
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
  });

  // Test 2 - Check register page loads (GET request)
  test('should return 200 on register page', async ({ request }) => {
    const response = await request.get('https://www.quisells.com/register');
    expect(response.status()).toBe(200);
  });

  // Test 3 - Check forgot password page loads (GET request)
  test('should return 200 on forgot password page', async ({ request }) => {
    const response = await request.get('https://www.quisells.com/forgot-password');
    expect(response.status()).toBe(200);
  });

  // Test 4 - Check response headers
  test('should have correct content type header', async ({ request }) => {
    const response = await request.get('https://www.quisells.com/login');
    const contentType = response.headers()['content-type'];
    expect(contentType).toContain('text/html');
  });

  // Test 5 - Check page response time
  test('should load login page within acceptable time', async ({ request }) => {
    const start = Date.now();
    const response = await request.get('https://www.quisells.com/login');
    const duration = Date.now() - start;
    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(5000);
    console.log(`Login page loaded in ${duration}ms`);
  });

 
});