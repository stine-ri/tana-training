# @smoke      = Run this on every deploy — adding a list is core Trello functionality
# @regression = Run on every code change to ensure nothing is broken
# @api        = Marks this as an API-level test (no UI involved)
# @trello     = Specific to Trello integration
# @happy-path = Valid input, expects success
# @negative-path = Invalid input, expects failure
# @boundary   = Tests the edge/limit of what the API accepts

Feature: Add List to Trello Board
  As a Trello user
  I want to add a list to a board
  So that I can organize my cards

  # @smoke: Adding a list is a core workflow — must work on every deploy
  @smoke @regression @api @trello @happy-path
  Scenario: Successfully add a list to an existing board
    Given I have a valid Trello API key and token
    And a board exists with a valid board id
    When I send a POST request to add a list with name "To Do"
    Then the response status code should be 200
    And the response should contain a list id
    And the list name should be "To Do"

  # @regression: Confirms the API still blocks lists on deleted boards after any change
  @regression @api @trello @negative-path
  Scenario: Fail to add a list to a deleted board
    Given I have a valid Trello API key and token
    And the board has been deleted
    When I send a POST request to add a list with name "To Do"
    Then the response status code should be 401

  # @regression: Confirms the API still handles max length list names after any change
  @regression @api @trello @boundary
  Scenario: Add a list with maximum character limit name
    Given I have a valid Trello API key and token
    And a board exists with a valid board id
    When I send a POST request to add a list with name "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    Then the response status code should be 200
    And the response should contain a list id