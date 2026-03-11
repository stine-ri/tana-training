import { Given, Then } from '@cucumber/cucumber';
import { request } from '@playwright/test';
import { TrelloAPI } from '../../tests/api/TrelloAPI';
import * as dotenv from 'dotenv';

dotenv.config();

// Shared Setup 

Given('I have a valid Trello API key and token', async function () {
  const apiKey = process.env.TRELLO_API_KEY!;
  const apiToken = process.env.TRELLO_TOKEN!;
  const requestContext = await request.newContext();
  this.trelloAPI = new TrelloAPI(requestContext, apiKey, apiToken);
});

Given('a board exists with a valid board id', async function () {
  const board = await this.trelloAPI.createBoard('Test Board for List');
  this.boardId = board.id;
});

Given('a list exists with a valid list id', async function () {
  const board = await this.trelloAPI.createBoard('Test Board for Card');
  this.boardId = board.id;
  const list = await this.trelloAPI.createList(this.boardId, 'Test List for Card');
  this.listId = list.id;
});

Given('the board has been deleted', async function () {
  const board = await this.trelloAPI.createBoard('Board To Delete');
  this.boardId = board.id;
  const list = await this.trelloAPI.createList(this.boardId, 'List on deleted board');
  this.listId = list.id;
  await this.trelloAPI.deleteBoard(this.boardId);
});

// Shared Assertion 

Then('the response status code should be {int}', function (expectedStatus: number) {
  if (this.statusCode !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus} but got ${this.statusCode}`);
  }
});