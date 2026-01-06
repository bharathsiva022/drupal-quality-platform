Feature: INX International - Component Visual Tests

  @component_existing
  Scenario: Compare existing live components with dev
    Given I load pages from fixture "inx_components.json"
    When I capture Percy snapshots for each page

