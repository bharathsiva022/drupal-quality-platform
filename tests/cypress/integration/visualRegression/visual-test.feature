Feature: INX International - Redesign Visual Tests

  @visual_existing
  Scenario: Compare existing live with dev
    Given I load pages from fixture "inx_int_existing.json"
    When I capture Percy snapshots for each page

  @visual_redesign
  Scenario: Compare Figma design with Dev
    Given I load pages from fixture "inx_int_redesign.json"
    When I capture Percy snapshots for each page
