import { APIRequestContext, APIResponse } from '@playwright/test';

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

  private get authParams() {
    return `key=${this.apiKey}&token=${this.apiToken}`;
  }

  //  Central error-handling wrapper
  private async handleResponse(response: APIResponse): Promise<any> {
    if (!response.ok()) {
      const body = await response.text();
      throw new Error(
        `API request failed.\n` +
        `Status: ${response.status()} ${response.statusText()}\n` +
        `URL: ${response.url()}\n` +
        `Response body: ${body}`
      );
    }
    return response.json();
  }

  async createBoard(name: string): Promise<any> {
    const response = await this.request.post(
      `${this.baseUrl}/boards/?${this.authParams}&name=${encodeURIComponent(name)}`
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