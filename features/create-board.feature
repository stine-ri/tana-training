Feature: Create Trello Board
  As a Trello user
  I want to create a board
  So that I can organize my work

  # Happy Path
  Scenario: Successfully create a board with a valid name
    Given I have a valid Trello API key and token
    When I send a POST request to create a board with name "My Project Board"
    Then the response status code should be 200
    And the response should contain a board id
    And the board name should be "My Project Board"

  # Negative Path
  Scenario: Fail to create a board with an empty name
    Given I have a valid Trello API key and token
    When I send a POST request to create a board with name ""
    Then the response status code should be 400

  # Boundary Analysis
  Scenario: Create a board with maximum character limit name
    Given I have a valid Trello API key and token
    When I send a POST request to create a board with name "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    Then the response status code should be 200
    And the response should contain a board id