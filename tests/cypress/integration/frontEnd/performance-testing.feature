Feature: Performance checks

Background:
    Given I load the test pages from fixture "inx_int_redesign.json"

@Performance
  Scenario: Run performance audits for a set of pages from JSON
    When I run performance checks for 10 pages from 'inx_int_existing.json' file
    Then I generate a performance summary report
