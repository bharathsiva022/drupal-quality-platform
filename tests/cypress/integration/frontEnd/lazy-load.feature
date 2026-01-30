Feature: Lazy Load Verification

  Scenario: Verify lazy loading for large images 
    When I navigate to "/events"
    Then large images should be lazy loaded