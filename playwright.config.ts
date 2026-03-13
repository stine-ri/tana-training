import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';

export default defineConfig({
  testDir: './tests',

  testIgnore: process.env.CI
    ? ['**/login*.test.ts', '**/login.test.ts']
    : [],
  // Skips all login tests in CI — they require manual auth via Chrome profile
  // and Google blocks automated login attempts in headless environments

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
    // All page.goto('/boards') calls will automatically prefix with this URL

    storageState: fs.existsSync('tests/auth/storageState.json')
      ? 'tests/auth/storageState.json'
      : undefined,
    // Reuses the saved login session from pnpm auth:trello
    // This means every test starts already logged into Trello
    // without having to go through the login flow every time

    screenshot: 'on',           // screenshot every step
    trace: 'on',                // full trace viewer
    video: 'on',                // video recording of every test

    launchOptions: { slowMo: process.env.CI ? 0 : 500 },
    // CI: no slow motion for speed
    // Local: 500ms so you can see what's happening
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // storageState is inherited from the global use config above
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
      // Firefox also uses the storageState from the global config
    },
    // webkit disabled - not supported on this Ubuntu setup
  ],
});