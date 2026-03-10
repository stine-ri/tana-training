Feature: Add List to Trello Board
  As a Trello user
  I want to add a list to a board
  So that I can organize my cards

  # Happy Path
  Scenario: Successfully add a list to an existing board
    Given I have a valid Trello API key and token
    And a board exists with a valid board id
    When I send a POST request to add a list with name "To Do"
    Then the response status code should be 200
    And the response should contain a list id
    And the list name should be "To Do"

  # Negative Path
  Scenario: Fail to add a list to a deleted board
    Given I have a valid Trello API key and token
    And the board has been deleted
    When I send a POST request to add a list with name "To Do"
    Then the response status code should be 404

  # Boundary Analysis
  Scenario: Add a list with maximum character limit name
    Given I have a valid Trello API key and token
    And a board exists with a valid board id
    When I send a POST request to add a list with name "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    Then the response status code should be 200
    And the response should contain a list id