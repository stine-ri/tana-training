import { Page, Locator } from '@playwright/test';
// toHaveScreenshot() removed — only works in Playwright test runner, not Cucumber
// Visual screenshots are handled in the step definition instead

export class BoardPage {

  readonly page: Page;
  readonly boardTitle: Locator;
  readonly addListButton: Locator;
  readonly listNameInput: Locator;
  readonly addListConfirmButton: Locator;
  readonly cardNameInput: Locator;
  readonly addCardConfirmButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // ✅ Senior QA Fix 1: uses /.+/ regex instead of { level: 1 }
    // Resilient to heading level changes (H1 → H2 etc.)
    this.boardTitle = page.getByRole('heading', { name: /.+/ });

    this.addListButton = page.getByRole('button', { name: 'Add a list', exact: false });
    this.listNameInput = page.getByPlaceholder('Enter list name…');
    this.addListConfirmButton = page.getByRole('button', { name: 'Add list' });
    this.cardNameInput = page.getByPlaceholder('Enter a title or paste a link');
    this.addCardConfirmButton = page.getByRole('button', { name: 'Add card' });
  }

  // Opens the board URL and waits for the page to load
  async navigateToBoard(boardUrl: string): Promise<void> {
    await this.page.goto(boardUrl);
    await this.page.waitForLoadState('domcontentloaded');
  }

  // Returns the visible text of the board title heading
  async getBoardTitle(): Promise<string> {
    return await this.boardTitle.innerText();
  }

  // Returns true if a board with the given name is visible on the page
  async validateBoardIsVisible(boardName: string): Promise<boolean> {
    const title = this.page.getByRole('heading', { name: boardName });
    return await title.isVisible();
  }

  // ✅ Senior QA Fix 2: scoped inside listitem container first
  // Prevents false matches if a card has the same name as a list
  getListLocator(listName: string): Locator {
    return this.page
      .getByRole('listitem')
      .filter({ hasText: listName })
      .getByRole('heading', { name: listName });
  }

  // Returns true if a list with the given name is visible on the board
  async validateListIsVisible(listName: string): Promise<boolean> {
    return await this.getListLocator(listName).isVisible();
  }

  // Returns the "Add a card" button scoped to a specific list
  getAddCardButton(listName: string): Locator {
    return this.page
      .getByRole('listitem')
      .filter({ has: this.page.getByRole('heading', { name: listName }) })
      .getByRole('button', { name: 'Add a card' });
  }

  // ✅ Senior QA Fix 3: added .or(getByText) fallback
  // Resilient if Trello changes cards from <a> links to <div> elements
  async validateCardIsVisible(cardName: string): Promise<boolean> {
    const card = this.page
      .getByRole('link', { name: cardName, exact: true })
      .or(this.page.getByText(cardName, { exact: true }));
    return await card.isVisible();
  }

  // Waits until a card becomes visible — use after API creates a card
  // to give the UI time to catch up before asserting
  async waitForCard(cardName: string): Promise<void> {
    const card = this.page
      .getByRole('link', { name: cardName, exact: true })
      .or(this.page.getByText(cardName, { exact: true }));
    await card.waitFor({ state: 'visible', timeout: 10000 });
  }

  // Returns the number of cards visible in a specific list
  async getCardCount(listName: string): Promise<number> {
    const listContainer = this.page
      .getByRole('listitem')
      .filter({ has: this.page.getByRole('heading', { name: listName }) });
    const cards = listContainer.getByRole('link');
    return await cards.count();
  }
}