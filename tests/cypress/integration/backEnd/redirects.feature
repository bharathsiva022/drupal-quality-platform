Feature: Url Redirects

  Background:
    Given I login to admin dashboard with username 'username' and password 'password'

  Scenario: Validate up to 5 redirects from redirects admin page
    When I open the redirects admin page
    Then I validate the first 5 From To redirects
