@hybrid @smoke @regression @trello
Feature: Hybrid Board Validation
  As a Trello user
  I want to verify that cards created via API are visible in the UI
  So that I can confirm the API and UI are in sync

  @hybrid @smoke @regression @trello @happy-path
  Scenario: Card created via API should be visible on the Trello board
    Given I have a valid Trello API key and token
    And a board and list are created via API
    When I create a card via API with name "Fix login bug"
    Then I navigate to the board in the browser
    And the card "Fix login bug" should be visible on the board