import { When, Then } from '@cucumber/cucumber';

/*
  {string} captures the board name from the feature file e.g. "My Project Board"
try/catch wraps the API call because handleResponse in TrelloAPI throws an error on non-200 responses
Happy path (try block): call succeeds, store the response and set statusCode to 200
Sad path (catch block): the error message contains Status: 400 (from our handleResponse formatter), so we use regex match(/Status: (\d+)/) to extract that number
parseInt(match[1]) converts the captured string "400" to the number 400
this.response = null signals to the Then steps that there's no response body to check
*/
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

/*
 Checks this.response (set in the When step) has an id property
!this.response guards against null (the error case)
!this.response.id guards against Trello returning a response without an id
*/
Then('the response should contain a board id', function () {
  if (!this.response || !this.response.id) {
    throw new Error('Response does not contain a board id');
  }
});

/*{string} captures the expected name from the feature file
Compares this.response.name (what Trello actually created) against what the test expects
If they differ, throws a descriptive error so you know exactly what went wrong*/ 
Then('the board name should be {string}', function (expectedName: string) {
  if (this.response.name !== expectedName) {
    throw new Error(`Expected board name "${expectedName}" but got "${this.response.name}"`);
  }
});