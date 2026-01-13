Feature: Verify Basic Auth Shield

  Scenario Outline: Verify shield status on dev environments
    Given I load the site configuration from "dev.json"
    When I check authentication protection for the configured site
    Then the shield "should" be enabled

  Scenario Outline: Verify shield status on prod environments
    Given I load the site configuration from "prod.json"
    When I check authentication protection for the configured site
    Then the shield "should not" be enabled