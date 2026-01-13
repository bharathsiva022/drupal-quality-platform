Feature: MCP Server Integration
  As a developer
  I want to be able to interact with the MCP server
  So that I can leverage AI capabilities in my tests

  @mcp
  Scenario: Fetch test data from MCP server
    When I send the command "getTestUserData" to the MCP server
    Then I should receive a response
