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
    baseURL: 'https://trello.com',
    // Changed from quisells.com to trello.com — all page.goto('/boards') calls
    // will automatically prefix with this URL

    storageState: 'tests/auth/storageState.json',
    // Reuses the saved login session from pnpm auth:trello
    // This means every test starts already logged into Trello
    // without having to go through the login flow every time

    screenshot: 'on',           // screenshot every step
    trace: 'on',                // full trace viewer
    video: 'on',                // video recording of every test

    launchOptions: { slowMo: 500 },
    // Reduced from 1000ms to 500ms — fast enough to see what's happening
    // but not so slow that tests take forever
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // storageState is inherited from the global use config above
        // so we removed the storageState: undefined override that was blocking it
        launchOptions: {
          args: [
            '--disable-save-password-bubble',
            '--disable-features=PasswordManagerEnabled'
          ]
        }
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      // Firefox will also use the storageState from the global config
    },
    // webkit disabled - not supported on this Ubuntu setup
  ],
});