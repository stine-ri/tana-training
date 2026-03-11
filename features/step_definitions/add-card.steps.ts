import { When, Then } from '@cucumber/cucumber';

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