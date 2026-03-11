# @smoke      = Run this first on every deploy — if board creation fails, nothing else works
# @regression = Run on every code change to ensure nothing is broken
# @api        = Marks this as an API-level test (no UI involved)
# @trello     = Specific to Trello integration
# @happy-path = Valid input, expects success
# @negative-path = Invalid input, expects failure
# @boundary   = Tests the edge/limit of what the API accepts

Feature: Create Trello Board
  As a Trello user
  I want to create a board
  So that I can organize my work

  # @smoke: Most critical scenario — if you can't create a board, the whole app is broken
  # @regression: Always run this to confirm happy path still works after any change
  @smoke @regression @api @trello @happy-path
  Scenario: Successfully create a board with a valid name
    Given I have a valid Trello API key and token
    When I send a POST request to create a board with name "My Project Board"
    Then the response status code should be 200
    And the response should contain a board id
    And the board name should be "My Project Board"

  # @regression: Run this to confirm the API still rejects empty names after any change
  # No @smoke here — negative path is not critical enough for a quick smoke check
  @regression @api @trello @negative-path
  Scenario: Fail to create a board with an empty name
    Given I have a valid Trello API key and token
    When I send a POST request to create a board with name ""
    Then the response status code should be 400

  # @regression: Run this to confirm the API still handles max length after any change
  # No @smoke here — boundary checks are thorough but not quick smoke material
  @regression @api @trello @boundary
  Scenario: Create a board with maximum character limit name
    Given I have a valid Trello API key and token
    When I send a POST request to create a board with name "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    Then the response status code should be 200
    And the response should contain a board id