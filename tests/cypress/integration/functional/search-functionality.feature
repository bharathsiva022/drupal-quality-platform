Feature: INX Search Functionality
    Background: Admin login
        Given I login to admin dashboard with username 'username' and password 'password'

    @regression_fe
    Scenario: Successful search with valid keyword
        When I enter "ink" in the search bar
        And I click on the search button
        Then I should see search results related to "ink"

    @regression_fe
    Scenario: search with invalid keyword
        When I enter "123456" in the search bar
        And I click on the search button
        Then I should see the message "No Results Found."

    @regression_fe
    Scenario: search with empty input
        When I click the search button without entering a search term
        Then I should see the message "No Results Found."

