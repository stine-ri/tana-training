//BDD is behavior Driven Development
//BDD is a software development process that encourages collaboration between developers, testers, and business stakeholders. It focuses on defining the behavior of a system through examples and scenarios, which are written in a natural language format that can be easily understood by all parties involved. BDD helps to ensure that the software being developed meets the needs of the users and provides a clear understanding of the expected behavior of the system.
//In BDD, scenarios are typically written in a Given-When-Then format, where "Given" describes the initial context or state of the system, "When" describes the action or event that triggers the behavior, and "Then" describes the expected outcome or result. This format helps to create a clear and concise description of the behavior being tested, making it easier for developers and testers to understand and implement the necessary code to meet the requirements.
//Three phases of BDD are:
//1. Discovery: In this phase, the team collaborates to identify and define the features and scenarios that need to be implemented. This involves discussions between developers, testers, and business stakeholders to ensure a shared understanding of the requirements and expected behavior of the system.

//2. Formulation: In this phase, the team writes the scenarios in a natural language format using the Given-When-Then structure. This helps to create a clear and concise description of the behavior being tested, making it easier for developers and testers to understand and implement the necessary code to meet the requirements.

//3. Automation: In this phase, the team implements automated tests based on the scenarios defined in the formulation phase. This involves writing code to execute the tests and verify that the expected behavior is achieved. Automated tests help to ensure that the software continues to meet the requirements as it evolves over time.

// What is cucumber- a tool that supports BDD by allowing teams to write scenarios in a natural language format and automate the testing of those scenarios. Cucumber provides a framework for defining and executing tests based on the Given-When-Then structure, making it easier for developers, testers, and business stakeholders to collaborate and ensure that the software being developed meets the needs of the users. Cucumber can be used with various programming languages and testing frameworks, making it a versatile tool for BDD.
/* 
Gherkin- Gherkin is a language used to write scenarios in BDD. It is a simple, structured language that allows teams to define the behavior of a system in a natural language format. Gherkin uses keywords such as Given, When, Then, And, and But to structure the scenarios and make them easy to read and understand. Gherkin scenarios are typically stored in .feature files, which can be executed using tools like Cucumber to automate the testing of the defined behavior.
example of a Gherkin scenario:

Feature: User Login

  Scenario: Successful login with valid credentials
    Given I have valid login credentials
      | username | password |
      | user1    | pass123  |
    When I send a POST request to "/api/login" with my credentials
    Then the response status code should be 200
    And the response should contain an access token
    And the response should contain user information

  Scenario: Unsuccessful login with invalid credentials
    Given I have invalid login credentials
      | username | password |
      | user1    | wrongpass|
    When I send a POST request to "/api/login" with my credentials
    Then the response status code should be 401
    And the response should contain an error message   
      Given-precondition
        When-action
        and- additional precondition or action, some more of previous step
        Then-expected outcome
           
*/