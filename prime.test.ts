// Function to check if a number is prime
function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

import { test, expect } from '@playwright/test';

test.describe('Authentication API Tests', () => {
  // Test for user registration API endpoint
  // This test verifies that a new user can successfully register
  // by sending a POST request with user details and checking for a successful response
  test('should register a new user', async ({ request }) => {
    const response = await request.post('/api/auth/register', {
      data: {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('user');
    expect(responseBody).toHaveProperty('token');
  });

  // Test for user login API endpoint
  // This test verifies that an existing user can successfully log in
  // by sending a POST request with credentials and checking for authentication token
  test('should login an existing user', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('user');
    expect(responseBody).toHaveProperty('token');
    expect(typeof responseBody.token).toBe('string');
  });
});
