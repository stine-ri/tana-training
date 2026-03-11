import { When, Then } from '@cucumber/cucumber';

When('I send a POST request to add a list with name {string}', async function (listName: string) {
  try {
    const response = await this.trelloAPI.createList(this.boardId, listName);
    this.response = response;
    this.statusCode = 200;
    this.listId = response.id;
  } catch (error: any) {
    const match = error.message.match(/Status: (\d+)/);
    this.statusCode = match ? parseInt(match[1]) : 500;
    this.response = null;
  }
});

Then('the response should contain a list id', function () {
  if (!this.response || !this.response.id) {
    throw new Error('Response does not contain a list id');
  }
});

Then('the list name should be {string}', function (expectedName: string) {
  if (this.response.name !== expectedName) {
    throw new Error(`Expected list name "${expectedName}" but got "${this.response.name}"`);
  }
});