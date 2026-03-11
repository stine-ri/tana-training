# @smoke      = Run this on every deploy — adding a card is the most used Trello action
# @regression = Run on every code change to ensure nothing is broken
# @api        = Marks this as an API-level test (no UI involved)
# @trello     = Specific to Trello integration
# @happy-path = Valid input, expects success
# @negative-path = Invalid input, expects failure
# @boundary   = Tests the edge/limit of what the API accepts
# @data-driven = Test uses external data file to loop through multiple inputs

Feature: Add Card to Trello List
  As a Trello user
  I want to add a card to a list
  So that I can track my tasks

  # @smoke: Creating a card is the #1 core action in Trello — must work on every deploy
  @smoke @regression @api @trello @happy-path
  Scenario: Successfully add a card to an existing list
    Given I have a valid Trello API key and token
    And a list exists with a valid list id
    When I send a POST request to add a card with name "Fix login bug"
    Then the response status code should be 200
    And the response should contain a card id
    And the card name should be "Fix login bug"

  # @regression: Confirms the API still returns 404 for cards on deleted boards
  @regression @api @trello @negative-path
  Scenario: Fail to add a card to a deleted board
    Given I have a valid Trello API key and token
    And the board has been deleted
    When I send a POST request to add a card with name "Fix login bug"
    Then the response status code should be 404

  # @regression: Confirms the API still handles max length card names after any change
  @regression @api @trello @boundary
  Scenario: Add a card with maximum character limit name
    Given I have a valid Trello API key and token
    And a list exists with a valid list id
    When I send a POST request to add a card with name "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    Then the response status code should be 200
    And the response should contain a card id

  # @data-driven: Uses cards.json to loop through 20 nasty strings — not a smoke test
  # because it's slow (20 API calls), but always part of regression
  @regression @api @trello @data-driven
  Scenario: Create cards using nasty strings from external data file
    Given I have a valid Trello API key and token
    And a list exists with a valid list id
    When I create cards from the nasty strings data file
    Then the response status code should be 200