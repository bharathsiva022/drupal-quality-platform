Feature: Console Errors Handling Across All Pages

  Scenario: capture console and network errors
    Given I visit 5 pages from the JSON file "inx_int_redesign.json"
    Then I capture and display all console and network errors for each page
