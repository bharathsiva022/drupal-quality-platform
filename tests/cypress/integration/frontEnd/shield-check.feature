Feature: Verify Basic Auth Shield

  Scenario: Verify shield status based on environment
    Given I load the site configuration based on environment
    Then the shield status should match the environment
