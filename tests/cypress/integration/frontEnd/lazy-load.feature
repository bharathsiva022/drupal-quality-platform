Feature: Lazy Load Verification

  @drupal_checks
  Scenario: Verify lazy loading for large images 
    When I navigate to "/events"
    Then large images should be lazy loaded