import { Page, Locator } from '@playwright/test';
// Page     → Playwright's browser tab instance. Every action (click, type, navigate) goes through this.
// Locator  → Playwright's way of pointing to a UI element. It's lazy — it doesn't search the DOM
//            until you actually interact with it (e.g. .click(), .isVisible()). This makes it
//            more reliable than querySelector which runs immediately and can fail if the page isn't ready.

// ─── What is the Page Object Model (POM)? ─────────────────────────────────────
// POM is a design pattern that wraps all UI interactions for ONE page into ONE class.
//
// Without POM (bad):                     With POM (good):
//   await page.click('.board-name')        await boardPage.getBoardTitle()
//   await page.click('[data-testid=...]')  await boardPage.validateCardIsVisible('Fix bug')
//
// Benefits:
//   1. If Trello changes a CSS class, you fix it in ONE place (here), not in every test file
//   2. Tests read like plain English — easier for non-technical teammates to understand
//   3. Locators are defined once and reused, reducing duplication
// ──────────────────────────────────────────────────────────────────────────────

export class BoardPage {

  // ─── Properties ─────────────────────────────────────────────────────────────
  // 'readonly' means these can only be set in the constructor and never changed after.
  // This protects them from being accidentally overwritten in a test.

  readonly page: Page;
  // The Playwright Page instance — all browser interactions flow through this.
  // Stored as a property so every method in this class can use it via this.page

  // ─── Locators ────────────────────────────────────────────────────────────────
  // Locators are defined as class properties so they are:
  //   - Written ONCE and reused across all methods
  //   - Easy to update if the UI changes (one place to fix)
  //   - Self-documenting — the property name tells you what element it points to
  //
  // LOCATOR STRATEGY — Why we avoid CSS classes like '.board-name-input':
  //   ❌ Brittle:   page.locator('.mod-board-name')        → breaks if dev renames the class
  //   ❌ Brittle:   page.locator('div > span > input')     → breaks if HTML structure changes
  //   ✅ Resilient: page.getByRole('heading', {name: ...}) → tied to semantics, not styling
  //   ✅ Resilient: page.getByPlaceholder('Enter name')    → tied to user-facing text
  //   ✅ Resilient: page.getByRole('button', {name: ...})  → tied to accessible button label
  //
  // SENIOR QA REVIEW FIXES APPLIED:
  //   Fix 1 → boardTitle: removed level:1 (too rigid), now uses /.+/ regex to match any heading
  //   Fix 2 → getListLocator: scoped to listitem containers to prevent matching card names
  //   Fix 3 → validateCardIsVisible: added .or() fallback in case Trello changes cards from <a> to <div>

  readonly boardTitle: Locator;
  // Points to the main heading at the top of the board (e.g. "My Project Board")
  // Used to verify the correct board has loaded after navigation
  //
  // ✅ FIX APPLIED (Fix 1):
  //   ❌ Before: page.getByRole('heading', { level: 1 })
  //      Problem: Assumes the board title is always an H1. If Trello changes it to H2,
  //               this locator silently breaks and all board title checks fail.
  //   ✅ After:  page.getByRole('heading', { name: /.+/ })
  //      Why better: /.+/ is a regex that matches ANY non-empty heading text.
  //                  It doesn't care about the heading level — only that a heading exists.

  readonly addListButton: Locator;
  // Points to the "Add a list" button that appears after all existing lists
  // Clicking this opens the input form to create a new list
  // Strategy: getByRole('button') + name — targets the accessible button label
  // ✅ Already resilient — no changes needed from code review

  readonly listNameInput: Locator;
  // Points to the text input that appears after clicking "Add a list"
  // Used to type the name of the new list being created
  // Strategy: getByPlaceholder — targets the user-facing placeholder text inside the input
  // ✅ Already resilient — placeholder text is stable and user-facing

  readonly addListConfirmButton: Locator;
  // Points to the "Add list" submit button that saves the new list name
  // Appears after the listNameInput is shown
  // Strategy: getByRole('button') + name
  // ✅ Already resilient — no changes needed from code review

  readonly cardNameInput: Locator;
  // Points to the text input that appears after clicking "Add a card" inside a list
  // Used to type the name of the new card being created
  // Strategy: getByPlaceholder — targets the placeholder text inside the card input
  // ✅ Already resilient — no changes needed from code review

  readonly addCardConfirmButton: Locator;
  // Points to the "Add card" submit button that saves the new card
  // Appears after the cardNameInput is shown
  // Strategy: getByRole('button') + name
  // ✅ Already resilient — no changes needed from code review

  // ─── Constructor ─────────────────────────────────────────────────────────────
  // The constructor runs ONCE when you create a new BoardPage(page) instance.
  // It receives the Playwright Page object and uses it to initialise all locators.
  //
  // How to use this in a step definition:
  //   const boardPage = new BoardPage(page);  ← creates the instance
  //   await boardPage.navigateToBoard(url);   ← uses the methods
  constructor(page: Page) {
    this.page = page;
    // Store the page so all methods below can access it via this.page

    this.boardTitle = page.getByRole('heading', { name: /.+/ });
    // ✅ FIXED: /.+/ regex matches any non-empty heading regardless of level (H1, H2, etc.)
    // Previously used { level: 1 } which was brittle — now resilient to heading level changes

    this.addListButton = page.getByRole('button', { name: 'Add a list', exact: false });
    // exact: false means it matches even if the button text has extra whitespace or
    // slightly different casing — makes the locator more forgiving of minor UI tweaks

    this.listNameInput = page.getByPlaceholder('Enter list name…');
    // Placeholder text is user-facing — Trello is unlikely to change it without
    // intentionally changing the UX, making it a stable locator choice

    this.addListConfirmButton = page.getByRole('button', { name: 'Add list' });
    // Targets the specific confirm button by its accessible name
    // Different from addListButton — this one submits the form, that one opens it

    this.cardNameInput = page.getByPlaceholder('Enter a title or paste a link');
    // Trello's card input has a distinctive placeholder — stable and user-facing

    this.addCardConfirmButton = page.getByRole('button', { name: 'Add card' });
    // Targets the submit button for the card creation form
  }

  // ─── Methods ─────────────────────────────────────────────────────────────────
  // Methods represent USER ACTIONS or VALIDATIONS on this page.
  // Each method does ONE thing and is named to describe that thing clearly.
  // 'async' is required because all Playwright browser interactions are asynchronous
  // — they involve real network/browser operations that take time.

  /**
   * navigateToBoard
   * ───────────────
   * Opens a Trello board in the browser by navigating to its URL.
   * Waits until the page HTML is fully loaded before returning.
   *
   * @param boardUrl - Full URL of the board e.g. https://trello.com/b/abc123/my-board
   *
   * When to use: Always the FIRST step in any UI test that involves a board.
   * Example in step definition:
   *   await boardPage.navigateToBoard('https://trello.com/b/abc123/my-board');
   */
  async navigateToBoard(boardUrl: string): Promise<void> {
    await this.page.goto(boardUrl);
    // goto() tells the browser to navigate to the given URL
    // It automatically waits for the page to start loading

    await this.page.waitForLoadState('domcontentloaded');
    // 'domcontentloaded' waits until the HTML is parsed and the DOM is ready
    // This is faster than 'networkidle' (which waits for ALL network requests to finish)
    // and more reliable than 'load' for single-page apps like Trello
  }

  /**
   * getBoardTitle
   * ─────────────
   * Reads and returns the visible text of the board's main heading.
   * Used to verify that the correct board has been opened after navigation.
   *
   * @returns The board title as a string e.g. "My Project Board"
   *
   * Example in step definition:
   *   const title = await boardPage.getBoardTitle();
   *   expect(title).toBe('My Project Board');
   */
  async getBoardTitle(): Promise<string> {
    return await this.boardTitle.innerText();
    // innerText() reads the visible text content of the element
    // It waits for the element to be visible before reading — built-in auto-wait
  }

  /**
   * validateBoardIsVisible
   * ──────────────────────
   * Checks whether a board with the given name is visible on the page.
   * Returns true if found, false if not.
   * Used as a smoke check after navigating to confirm the board loaded correctly.
   *
   * @param boardName - The exact name of the board to look for e.g. "My Project Board"
   * @returns true if the board heading is visible, false otherwise
   *
   * Example in step definition:
   *   const isVisible = await boardPage.validateBoardIsVisible('My Project Board');
   *   expect(isVisible).toBe(true);
   */
  async validateBoardIsVisible(boardName: string): Promise<boolean> {
    const title = this.page.getByRole('heading', { name: boardName });
    // Creates a locator targeting a heading with this exact name
    // More specific than this.boardTitle because it checks for a PARTICULAR board name

    return await title.isVisible();
    // isVisible() returns true/false immediately without throwing an error
    // Unlike waitFor() which throws if the element doesn't appear — use isVisible()
    // when you want to CHECK and decide what to do, use waitFor() when you MUST see it
  }

  /**
   * getListLocator
   * ──────────────
   * Returns a Playwright Locator pointing to a list heading with the given name.
   * This is a HELPER method — used internally by validateListIsVisible and other methods.
   *
   * @param listName - The name of the list e.g. "To Do"
   * @returns A Locator pointing to that list's heading element
   *
   * ✅ FIX APPLIED (Fix 2):
   *   ❌ Before: page.getByRole('heading', { name: listName })
   *      Problem: If a CARD is also named "To Do", Playwright finds multiple heading
   *               matches and throws an ambiguity error — the test breaks for the wrong reason.
   *   ✅ After:  Scoped inside a listitem container first, THEN find the heading within it.
   *      Why better: Limits the search to actual list containers only, ignoring card names
   *                  and any other headings that might accidentally match.
   */
  getListLocator(listName: string): Locator {
    return this.page
      .getByRole('listitem')
      // Find all list container elements on the board

      .filter({ hasText: listName })
      // Narrow down to only the listitem that contains our list name text

      .getByRole('heading', { name: listName });
      // Now find the heading WITHIN that scoped container — safe from false matches
      // Note: this is NOT async because creating a Locator doesn't touch the browser yet
  }

  /**
   * validateListIsVisible
   * ──────────────────────
   * Checks whether a list with the given name is visible on the board.
   * Used in Then steps to confirm a list was successfully created via API.
   *
   * @param listName - The name of the list to look for e.g. "To Do"
   * @returns true if the list heading is visible, false otherwise
   *
   * Example in step definition:
   *   const isVisible = await boardPage.validateListIsVisible('To Do');
   *   expect(isVisible).toBe(true);
   */
  async validateListIsVisible(listName: string): Promise<boolean> {
    return await this.getListLocator(listName).isVisible();
    // Reuses the getListLocator helper to find the list, then checks visibility
    // Keeps this method clean and avoids duplicating the locator logic
  }

  /**
   * getAddCardButton
   * ────────────────
   * Returns the "Add a card" button for a SPECIFIC list on the board.
   * Every list has its own "Add a card" button, so we must scope the search
   * to the correct list container first.
   *
   * @param listName - The name of the list whose "Add a card" button you want
   * @returns A Locator for the "Add a card" button scoped to that specific list
   *
   * Example in step definition:
   *   await boardPage.getAddCardButton('To Do').click();
   */
  getAddCardButton(listName: string): Locator {
    return this.page
      .getByRole('listitem')
      // Find all list containers on the board

      .filter({ has: this.page.getByRole('heading', { name: listName }) })
      // Narrow down to the listitem that contains a heading matching our list name
      // .filter({ has: locator }) is more precise than .filter({ hasText: text })
      // because it checks for a specific element type, not just any text match

      .getByRole('button', { name: 'Add a card' });
      // Find the "Add a card" button WITHIN that specific list container
      // ✅ Already resilient — scoping pattern was correct in original code
  }

  /**
   * validateCardIsVisible
   * ──────────────────────
   * Checks whether a card with the given name is visible anywhere on the board.
   * This is the PRIMARY Then step validation method — used after the API creates
   * a card to confirm it actually appears in the Trello UI.
   *
   * @param cardName - The exact name of the card to look for e.g. "Fix login bug"
   * @returns true if the card is visible, false otherwise
   *
   * ✅ FIX APPLIED (Fix 3):
   *   ❌ Before: page.getByRole('link', { name: cardName, exact: true })
   *      Problem: Assumes Trello ALWAYS renders cards as <a> link elements.
   *               If Trello ever changes cards to <div> or <button> elements,
   *               this locator finds nothing and all card validations silently fail.
   *   ✅ After:  Added .or() fallback using getByText as a safety net.
   *      Why better: If the link locator fails to find the card, it falls back to
   *                  searching by visible text — making it resilient to HTML tag changes.
   *
   * Example in step definition:
   *   const isVisible = await boardPage.validateCardIsVisible('Fix login bug');
   *   expect(isVisible).toBe(true);
   */
  async validateCardIsVisible(cardName: string): Promise<boolean> {
    const card = this.page
      .getByRole('link', { name: cardName, exact: true })
      // Primary strategy: find the card as a link element with exact name match
      // exact: true prevents 'Fix bug' from matching 'Fix login bug'

      .or(this.page.getByText(cardName, { exact: true }));
      // ✅ FIXED: .or() provides a fallback locator
      // If the link locator finds nothing, Playwright tries getByText instead
      // This makes the locator resilient to future HTML structure changes in Trello

    return await card.isVisible();
  }

  /**
   * waitForCard
   * ───────────
   * Waits until a card with the given name becomes visible on the board.
   * Use this instead of validateCardIsVisible when you EXPECT the card to appear
   * but need to give the UI time to catch up (e.g. after an API call creates it).
   *
   * @param cardName - The exact name of the card to wait for
   *
   * When to use vs validateCardIsVisible:
   *   - waitForCard()           → use when you KNOW the card should appear, just give it time
   *   - validateCardIsVisible() → use when you want to CHECK if it's there right now
   *
   * Example in step definition:
   *   await boardPage.waitForCard('Fix login bug');  // waits up to 10 seconds
   */
  async waitForCard(cardName: string): Promise<void> {
    const card = this.page
      .getByRole('link', { name: cardName, exact: true })
      .or(this.page.getByText(cardName, { exact: true }));
      // Same .or() fallback applied here for consistency with validateCardIsVisible

    await card.waitFor({ state: 'visible', timeout: 10000 });
    // waitFor() keeps checking until the element becomes visible or timeout is reached
    // timeout: 10000 = 10 seconds — enough time for Trello's UI to reflect an API change
    // If the card doesn't appear within 10 seconds, it throws an error and fails the test
  }

  /**
   * getCardCount
   * ────────────
   * Counts and returns the number of cards currently visible in a specific list.
   * Useful for boundary testing — e.g. after creating 5 cards via API,
   * confirm exactly 5 cards are visible in the list.
   *
   * @param listName - The name of the list to count cards in e.g. "To Do"
   * @returns The number of card links found in that list
   *
   * Example in step definition:
   *   const count = await boardPage.getCardCount('To Do');
   *   expect(count).toBe(5);
   */
  async getCardCount(listName: string): Promise<number> {
    const listContainer = this.page
      .getByRole('listitem')
      .filter({ has: this.page.getByRole('heading', { name: listName }) });
      // Scope to the specific list first — same pattern as getAddCardButton
      // This ensures we count only cards in THIS list, not cards in other lists

    const cards = listContainer.getByRole('link');
    // Find all link elements (cards) within that scoped list container

    return await cards.count();
    // count() returns the number of matching elements as a number
    // It waits for the locator to resolve before counting
  }
}