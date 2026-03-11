import { When, Then } from '@cucumber/cucumber';

When('I send a POST request to create a board with name {string}', async function (boardName: string) {
  try {
    const response = await this.trelloAPI.createBoard(boardName);
    this.response = response;
    this.statusCode = 200;
    this.boardId = response.id;
  } catch (error: any) {
    const match = error.message.match(/Status: (\d+)/);
    this.statusCode = match ? parseInt(match[1]) : 500;
    this.response = null;
  }
});

Then('the response should contain a board id', function () {
  if (!this.response || !this.response.id) {
    throw new Error('Response does not contain a board id');
  }
});

Then('the board name should be {string}', function (expectedName: string) {
  if (this.response.name !== expectedName) {
    throw new Error(`Expected board name "${expectedName}" but got "${this.response.name}"`);
  }
});