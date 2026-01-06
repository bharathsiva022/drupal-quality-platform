Feature: Drupal Upgrade Validation

  @regression_be
  Scenario: Validate key pages after upgrade
    Given I visit the "/company" page
    Then I should see the content title "Company"
    And the page should not contain any PHP or DB error

  @regression_be
  Scenario: Validate admin dashboard after upgrade
    Given I login to admin dashboard with username 'username' and password 'password'
    And I visit the "/admin" page
    Then I should see "Administration"
    And I should see the link "Content"
    And I should see the link "Blocks"
    And I should see the link "Media"
    Then the page should not contain any PHP or DB error

  @regression_be
  Scenario: Validate configuration pages accessibility
    Given I login to admin dashboard with username 'username' and password 'password'
    And I visit the "/admin/config" page
    Then I should see "Configuration"
    And I should see the link "People"
    Then the page should not contain any PHP or DB error