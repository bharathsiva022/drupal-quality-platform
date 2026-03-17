Feature: Drupal Upgrade Validation

  @regression @drupal_checks
  Scenario: Validate key pages after upgrade
    Given I visit the "/product-finder" page
    Then I should see the content title "Product Finder | INX International"
    And the page should not contain any PHP or DB error

  @regression @drupal_checks
  Scenario: Validate admin dashboard after upgrade
    Given I login to admin dashboard with username 'username' and password 'password'
    And I visit the "/admin" page
    Then I should see "Administration"
    And I should see the link "Content"
    And I should see the link "Blocks"
    And I should see the link "Media"
    Then the page should not contain any PHP or DB error

  @regression @drupal_checks
  Scenario: Validate configuration pages accessibility
    Given I login to admin dashboard with username 'username' and password 'password'
    And I visit the "/admin/config" page
    Then I should see "Configuration"
    And I should see the link "People"
    Then the page should not contain any PHP or DB error