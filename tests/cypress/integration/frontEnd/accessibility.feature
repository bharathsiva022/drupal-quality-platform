Feature: Accessibility checks 

Background: 
    Given I load the pages from fixture "inx_int_redesign.json"

@Accessibility
  Scenario: Run accessibility audit for set of pages in JSON 
    When  I run accessibility checks for 15 pages from 'inx_int_existing.json' file
    Then I generate a accessibility report
