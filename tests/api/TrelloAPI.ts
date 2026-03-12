import { APIRequestContext, APIResponse } from '@playwright/test'; //APIRequestContext and APIResponse are types from Playwright for handling API requests and responses

//Why class? The TrelloAPI class encapsulates all interactions with the Trello API, providing a clean and reusable interface for making API calls. It allows us to centralize error handling and authentication logic, making our test code cleaner and more maintainable. By using a class, we can easily create instances of the TrelloAPI with different credentials if needed, and it promotes better organization of our codebase.
//private-means these properties can't be accessed from outside the class, ensuring that the internal workings of the TrelloAPI are encapsulated and protected from unintended interference. This helps to maintain the integrity of the API interactions and prevents external code from accidentally modifying critical properties like the API key, token, or request context. By keeping these properties private, we can control how they are used and ensure that they are only accessed through the defined methods of the class, which can include necessary validation and error handling.
//baseURL is fixed, all Trello API endpoints start with 'https://api.trello.com/1', so we set it as a class property to avoid repetition and make it easier to maintain. If the base URL ever changes, we only need to update it in one place, rather than in every method that makes an API call. This promotes better code organization and reduces the risk of errors when constructing API request URLs.
//The constructor receives request from Playwright (created in your step definitions) and your credentials from .env
export class TrelloAPI {
  private request: APIRequestContext;
  private apiKey: string;
  private apiToken: string;
  private baseUrl: string = 'https://api.trello.com/1';

  constructor(request: APIRequestContext, apiKey: string, apiToken: string) {
    this.request = request;
    this.apiKey = apiKey;
    this.apiToken = apiToken;
  }
// authParams is a getter that constructs the authentication query parameters for Trello API requests. It combines the API key and token into a single string that can be appended to the URL of each API request, ensuring that all requests are properly authenticated without having to repeat the logic in every method. This promotes code reuse and keeps the API methods clean and focused on their specific functionality.
  private get authParams() {
    return `key=${this.apiKey}&token=${this.apiToken}`;
  }

  //  Central error-handling wrapper- This method checks if the API response is successful (status code 2xx). If not, it reads the response body and throws a detailed error that includes the status code, status text, request URL, and response body. This centralized error handling ensures that any issues with API requests are clearly reported, making it easier to debug and maintain the test suite.
  private async handleResponse(response: APIResponse): Promise<any> {
    if (!response.ok()) { // checks if the response status code indicates success (2xx). If not, it proceeds to handle the error.
      const body = await response.text(); // reads the response body as text, which can provide additional information about the error that occurred.
      throw new Error(  //throws a new error with a detailed message that includes the status code, status text, request URL, and response body. This information is crucial for debugging API issues, as it provides context about what went wrong and where.
        `API request failed.\n` +
        `Status: ${response.status()} ${response.statusText()}\n` +
        `URL: ${response.url()}\n` +
        `Response body: ${body}`
      );
    }
    return response.json(); // if the response is successful, it parses the response body as JSON and returns it, allowing the calling code to work with the API response data in a structured format.
  }

  //async- makes the method return a Promise, allowing us to use await when calling these methods to handle asynchronous API requests in a more readable and maintainable way. This is especially important for API interactions, which can involve network latency and require proper handling of asynchronous operations.
  //this.request.post(...)- uses the Playwright APIRequestContext to send a POST request to the specified Trello API endpoint. The URL is constructed using the base URL, authentication parameters, and any additional query parameters needed for the specific API call (e.g., board name, list name). The response from the API is then passed to the handleResponse method for error handling and JSON parsing.
  //encodeURIComponent(name)- ensures that any special characters in the name parameter (such as spaces, ampersands, etc.) are properly encoded for inclusion in the URL query string. This prevents issues with malformed URLs and ensures that the API receives the correct data.
  //${this.baseUrl}- constructs the full URL for the API request by combining the base URL with the specific endpoint and query parameters. This approach promotes code reuse and maintainability, as the base URL is defined in one place and can be easily updated if needed.Inserts https://api.trello.com/1/boards/?key=your_api_key&token=your_token&name=encoded_board_name
  //${this.authParams}-inserts the authentication parameters (key and token) into the URL, ensuring that the API request is properly authenticated. This allows the Trello API to verify the identity of the requester and grant access to the requested resources based on the provided credentials.
  //The createBoard method sends a POST request to the Trello API to create a new board with the specified name. It constructs the URL using the base URL, authentication parameters, and the encoded board name. The response from the API is then passed to the handleResponse method for error handling and JSON parsing, allowing the calling code to work with the created board's data in a structured format.
  //this.handleResponse(response)- processes the API response by checking if it was successful and parsing the response body as JSON. If the response indicates an error, it throws a detailed error message. This centralized error handling ensures that any issues with the API request are clearly reported, making it easier to debug and maintain the test suite.
  //the other methods (createList, createCard, deleteBoard) follow a similar pattern to createBoard, but they target different Trello API endpoints and include additional parameters specific to their functionality (e.g., boardId for creating lists, listId for creating cards). Each method constructs the appropriate URL, sends the API request, and handles the response in a consistent manner.
  /* How it all connects
```
.env file          →   apiKey, apiToken
common.steps.ts    →   creates TrelloAPI instance, passes request context + credentials
TrelloAPI.ts       →   makes the actual HTTP calls to Trello
step definitions   →   call trelloAPI.createBoard() etc. and store the response*/

  async createBoard(name: string): Promise<any> {
  const response = await this.request.post(
    `${this.baseUrl}/boards/?${this.authParams}&name=${encodeURIComponent(name)}&defaultLists=false&prefs_permissionLevel=public`
  );
  return this.handleResponse(response);
}

  async createList(boardId: string, name: string): Promise<any> {
    const response = await this.request.post(
      `${this.baseUrl}/lists?${this.authParams}&name=${encodeURIComponent(name)}&idBoard=${boardId}`
    );
    return this.handleResponse(response);
  }

  async createCard(listId: string, name: string): Promise<any> {
    const response = await this.request.post(
      `${this.baseUrl}/cards?${this.authParams}&name=${encodeURIComponent(name)}&idList=${listId}`
    );
    return this.handleResponse(response);
  }

  async deleteBoard(boardId: string): Promise<any> {
    const response = await this.request.delete(
      `${this.baseUrl}/boards/${boardId}?${this.authParams}`
    );
    return this.handleResponse(response);
  }
}