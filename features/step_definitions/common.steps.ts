import { Given, Then } from '@cucumber/cucumber'; //Given, then  are cucumber functions for defining steps, they link plain english steps in feature files to the actual code that executes those steps
import { request } from '@playwright/test';  //playwright's request function allows us to create a new API request context, which we can use to send HTTP requests to the Trello API. This is essential for our API testing, as it enables us to interact with the Trello API endpoints and validate their responses in our test scenarios.
import { TrelloAPI } from '../../tests/api/TrelloAPI';
import * as dotenv from 'dotenv'; //dotenv is a zero-dependency module that loads environment variables from a .env file into process.env. This allows us to keep sensitive information like API keys and tokens out of our codebase and easily manage them in a separate file. By using dotenv, we can access these environment variables in our test code without hardcoding them, enhancing security and flexibility.

dotenv.config(); // load the .env files, this line initializes the dotenv configuration, allowing us to access the environment variables defined in our .env file throughout our test code using process.env.VARIABLE_NAME. This is crucial for securely managing sensitive information like API keys and tokens without hardcoding them in our codebase.

// Shared Setup 

Given('I have a valid Trello API key and token', async function () {
  const apiKey = process.env.TRELLO_API_KEY!; // the ! tells TypeScript that we are sure this variable will be defined, since we have it in our .env file. This allows us to securely access the API key without hardcoding it in our codebase, and it ensures that our tests can run with the correct credentials.
  const apiToken = process.env.TRELLO_TOKEN!;
  const requestContext = await request.newContext(); //request.newContext() creates a new API request context that we can use to send HTTP requests to the Trello API. This context allows us to manage cookies, headers, and other settings for our API requests, making it easier to interact with the Trello API in our test scenarios.
  this.trelloAPI = new TrelloAPI(requestContext, apiKey, apiToken); // creates your service object and stores it on this. Using this is critical here — it makes trelloAPI available to every subsequent step in the same scenario
});

Given('a board exists with a valid board id', async function () {
  const board = await this.trelloAPI.createBoard('Test Board for List');
  this.boardId = board.id;
});//This is a precondition step, it runs real API calls to set up the state your test needs: Calls createBoard on your service class
// The response (board) is a JSON object from Trello containing an id, name, etc.
// this.boardId = board.id saves the board's ID so the When step can use it later

Given('a list exists with a valid list id', async function () {
  const board = await this.trelloAPI.createBoard('Test Board for Card');
  this.boardId = board.id;
  const list = await this.trelloAPI.createList(this.boardId, 'Test List for Card');
  this.listId = list.id;
});// Does two API calls: creates a board, then creates a list on that board. Saves both IDs for later steps to use when creating a card or deleting the board

Given('the board has been deleted', async function () {
  const board = await this.trelloAPI.createBoard('Board To Delete');
  this.boardId = board.id;
  const list = await this.trelloAPI.createList(this.boardId, 'List on deleted board');
  this.listId = list.id;
  await this.trelloAPI.deleteBoard(this.boardId);
});// This sets up the negative path- it creates a board and list, then immediately deletes the board.
//  This simulates the real-world scenario of trying to add something to a board that no longer exists. 
// The listId is kept so the card step has something to send to Trello, even though the board is gone.

// Shared Assertion 
Then('the response status code should be {int}', function (expectedStatus: number) {
  if (this.statusCode !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus} but got ${this.statusCode}`);
  }
}); /*{int} is a Cucumber parameter — it captures the number from the feature file (e.g. 200, 404) and passes it as expectedStatus
this.statusCode was set in the When step of each feature's step file
If they don't match, throwing an Error is how you fail a Cucumber step, Cucumber catches it and marks the step red*/