import { Given, Then, When, After } from '@cucumber/cucumber';
import { request } from '@playwright/test';
import { TrelloAPI } from '../../tests/api/TrelloAPI';
import * as dotenv from 'dotenv';
import { chromium } from '@playwright/test';
import { BoardPage } from '../../pages/boardPage';
import * as path from 'path';
import fs from 'fs';

dotenv.config();

// ─── Shared Setup ────────────────────────────────────────────────────────────

// Creates the TrelloAPI instance with credentials from .env
// Stored on `this` so every subsequent step in the scenario can use it
Given('I have a valid Trello API key and token', async function () {
  const apiKey = process.env.TRELLO_API_KEY!;
  const apiToken = process.env.TRELLO_TOKEN!;
  const requestContext = await request.newContext();
  this.trelloAPI = new TrelloAPI(requestContext, apiKey, apiToken);
});

// Creates a board and saves the boardId for list/card steps to use
Given('a board exists with a valid board id', async function () {
  const board = await this.trelloAPI.createBoard('Test Board for List');
  this.boardId = board.id;
});

// Creates a board + list and saves both IDs for card steps to use
Given('a list exists with a valid list id', async function () {
  const board = await this.trelloAPI.createBoard('Test Board for Card');
  this.boardId = board.id;
  const list = await this.trelloAPI.createList(this.boardId, 'Test List for Card');
  this.listId = list.id;
});

// Creates a board + list then immediately deletes the board
// Used for negative path tests — simulates trying to add to a deleted board
Given('the board has been deleted', async function () {
  const board = await this.trelloAPI.createBoard('Board To Delete');
  this.boardId = board.id;
  const list = await this.trelloAPI.createList(this.boardId, 'List on deleted board');
  this.listId = list.id;
  await this.trelloAPI.deleteBoard(this.boardId);
});

// ─── Hybrid Steps ─────────────────────────────────────────────────────────────

// Creates a public board + list via API for the hybrid UI test
Given('a board and list are created via API', async function () {
  const board = await this.trelloAPI.createBoard('Hybrid Test Board');
  this.boardId = board.id;
  this.boardUrl = board.url;
  const list = await this.trelloAPI.createList(this.boardId, 'Hybrid Test List');
  this.listId = list.id;
});

// Creates a card via API and stores the card name for UI validation
When('I create a card via API with name {string}', async function (cardName: string) {
  const card = await this.trelloAPI.createCard(this.listId, cardName);
  this.cardName = card.name;
  this.statusCode = 200;
});

// Opens a real browser, loads the saved session, and navigates to the board
Then('I navigate to the board in the browser', async function () {
  const storagePath = path.join(process.cwd(), 'tests/auth/storageState.json');

  if (!fs.existsSync(storagePath)) {
    throw new Error('No session found. Run pnpm auth:trello first');
  }

  this.browser = await chromium.launch({
    headless: false,
    slowMo: 300,
  });

  const context = await this.browser.newContext({
    storageState: storagePath,
  });

  this.page = await context.newPage();
  this.boardPage = new BoardPage(this.page);

  await this.boardPage.navigateToBoard(this.boardUrl);
  // navigateToBoard already uses domcontentloaded internally — no extra wait needed

  const url = this.page.url();
  if (url.includes('login')) {
    console.log('⚠️  Redirected to login — session may have expired');
    await this.page.screenshot({ path: 'login-redirect.png' });
  } else {
    console.log('✅ Successfully loaded board with saved session');
  }

  await this.page.screenshot({ path: 'debug-board.png' });
});

// Uses BoardPage POM to assert the card is visible on the board
Then('the card {string} should be visible on the board', async function (cardName: string) {
  const currentUrl = this.page.url();
  const pageContent = await this.page.content();

  if (currentUrl.includes('login') || pageContent.includes('Sign up to see this board')) {
    await this.page.screenshot({ path: 'login-blocking-card.png' });
    throw new Error(`Cannot see card — blocked by login page. Current URL: ${currentUrl}`);
  }

  try {
    await this.boardPage.waitForCard(cardName);
    const isVisible = await this.boardPage.validateCardIsVisible(cardName);
    if (!isVisible) {
      await this.page.screenshot({ path: 'card-not-visible.png' });
      throw new Error(`Card "${cardName}" was not visible on the board`);
    }
    console.log(`✓ Card "${cardName}" is visible on the Trello board UI`);
  } catch (error) {
    await this.page.screenshot({ path: 'board-state.png' });
    const bodyText = await this.page.textContent('body');
    console.log('Page text content:', bodyText?.substring(0, 500));
    throw error;
  } finally {
    await this.browser.close();
  }
});

// ─── Shared Assertion ────────────────────────────────────────────────────────

// Checks the status code set by any When step against the expected value
Then('the response status code should be {int}', function (expectedStatus: number) {
  if (this.statusCode !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus} but got ${this.statusCode}`);
  }
});

// ─── Cleanup ─────────────────────────────────────────────────────────────────

// Runs automatically after every scenario to delete any boards created during the test
// Prevents hitting Trello's 10 board free plan limit
After(async function () {
  if (this.boardId && this.trelloAPI) {
    try {
      await this.trelloAPI.deleteBoard(this.boardId);
      console.log(`🧹 Cleaned up board: ${this.boardId}`);
    } catch {
      // Board may already be deleted in negative path tests — ignore
    }
  }
});