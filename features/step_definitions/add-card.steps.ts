import { When, Then, setDefaultTimeout } from '@cucumber/cucumber';
import * as fs from 'fs';
import * as path from 'path';

setDefaultTimeout(60 * 1000); // 60 seconds - increase if you have a slow connection or Trello is being laggy

When('I send a POST request to add a card with name {string}', async function (cardName: string) {
  try {
    const response = await this.trelloAPI.createCard(this.listId, cardName);
    this.response = response;
    this.statusCode = 200;
    this.cardId = response.id;
  } catch (error: any) {
    const match = error.message.match(/Status: (\d+)/);
    this.statusCode = match ? parseInt(match[1]) : 500;
    this.response = null;
  }
});

When('I create cards from the nasty strings data file', async function () {
  const filePath = path.resolve('data/cards.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  const cards: { description: string; value: string }[] = JSON.parse(rawData);

  this.statusCode = 200; // default to 200

  for (const card of cards) {
    try {
      const response = await this.trelloAPI.createCard(this.listId, card.value);
      console.log(`✓ [${card.description}] → "${response.name}"`);
    } catch (error: any) {
      console.log(`✗ [${card.description}] → Failed: ${error.message.split('\n')[1]}`);
    }
  }
});
Then('the response should contain a card id', function () {
  if (!this.response || !this.response.id) {
    throw new Error('Response does not contain a card id');
  }
});

Then('the card name should be {string}', function (expectedName: string) {
  if (this.response.name !== expectedName) {
    throw new Error(`Expected card name "${expectedName}" but got "${this.response.name}"`);
  }
});
