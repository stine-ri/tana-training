Feature: User Login
  As a registered user
  I want to log into the application
  So that I can access my account

  Scenario: Successful login with valid credentials
    Given I have valid login credentials
      | username | emilys    |
      | password | emilyspass |
    When I send a POST request to "https://dummyjson.com/auth/login" with my credentials
    Then the response status code should be 200
    And the response should contain an access token
    And the response should contain user information

  Scenario: Failed login with invalid credentials
    Given I have invalid login credentials
      | username | emilys        |
      | password | wrongpassword |
    When I send a POST request to "https://dummyjson.com/auth/login" with my credentials
    Then the response status code should be 400
    And the response should contain an error message