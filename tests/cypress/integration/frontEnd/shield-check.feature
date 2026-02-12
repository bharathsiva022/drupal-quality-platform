Feature: Verify Basic Auth Shield

  @drupal_checks
  Scenario: Verify shield status based on environment
    Given I load the site configuration based on environment
    Then the shield status should match the environment
