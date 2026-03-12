import { chromium } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

// Uses your REAL Chrome browser profile instead of a Playwright-controlled browser.
// This bypasses Google's "this browser may not be secure" block because
// it looks like a normal Chrome session to Google.

async function saveTrelloSession() {
  const authDir = path.join(process.cwd(), 'tests', 'auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Path to your real Chrome profile on Ubuntu
  const chromeUserDataDir = path.join(
    process.env.HOME!,
    '.config',
    'google-chrome'
  );

  console.log('\n==============================================');
  console.log('Opening your REAL Chrome browser...');
  console.log('This bypasses Google security blocks.');
  console.log('==============================================\n');

  // launchPersistentContext uses your actual Chrome profile
  // where you are already logged into Google — no security block
  const context = await chromium.launchPersistentContext(chromeUserDataDir, {
    headless: false,
    channel: 'chrome', // use real Chrome, not Playwright's bundled Chromium
    args: [
      '--no-first-run',
      '--no-default-browser-check',
    ],
  });

  const page = await context.newPage();
  await page.goto('https://trello.com');

  console.log('👉 If not already logged in, log in now.');
  console.log('👉 Once you can see your Trello boards page,');
  console.log('👉 press ENTER in this terminal to save the session.\n');

  await new Promise<void>((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      resolve();
    });
  });

  const storagePath = path.join(authDir, 'storageState.json');
  await context.storageState({ path: storagePath });

  console.log('\n✓ Session saved to tests/auth/storageState.json');
  console.log('✓ Cookies saved:', (await context.cookies()).length);
  console.log('✓ You can now run your tests!');

  await context.close();
}

saveTrelloSession();