Feature: Add Card to Trello List
  As a Trello user
  I want to add a card to a list
  So that I can track my tasks

  # Happy Path
  Scenario: Successfully add a card to an existing list
    Given I have a valid Trello API key and token
    And a list exists with a valid list id
    When I send a POST request to add a card with name "Fix login bug"
    Then the response status code should be 200
    And the response should contain a card id
    And the card name should be "Fix login bug"

  # Negative Path
  Scenario: Fail to add a card to a deleted board
    Given I have a valid Trello API key and token
    And the board has been deleted
    When I send a POST request to add a card with name "Fix login bug"
    Then the response status code should be 404

  # Boundary Analysis
  Scenario: Add a card with maximum character limit name
    Given I have a valid Trello API key and token
    And a list exists with a valid list id
    When I send a POST request to add a card with name "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    Then the response status code should be 200
    And the response should contain a card id