import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html'],   // full HTML report with screenshots and traces
    ['list'],   // shows results in terminal as they run
  ],

  use: {
    baseURL: 'https://www.quisells.com',  // no need to repeat URL in every test

    screenshot: 'on',           // screenshot every step
    trace: 'on',                // full trace viewer
    video: 'on',                // video recording of every test
    // Slow motion, uncomment to slow down tests for debugging
    launchOptions: { slowMo: 1000 },
  },

  projects: [
  {
    name: 'chromium',
    use: { 
      ...devices['Desktop Chrome'],
      contextOptions: {
        // disable password manager and autofill
        storageState: undefined,
      },
      launchOptions: {
        args: ['--disable-save-password-bubble', '--disable-features=PasswordManagerEnabled']
      }
    },
  },
  {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
  },
    // webkit disabled - not supported on this Ubuntu setup
  ],
});