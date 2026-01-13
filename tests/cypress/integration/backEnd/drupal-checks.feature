Feature: Drupal Regression Checks 
  Background: Admin login
    Given I login to admin dashboard with username 'username' and password 'password'
    
@regression_be @core_custom
Scenario: Creating New User
  When I navigate to '/admin/people'  
  Then I click on "Add_user"  
  Then I enter the user details
  Then I click on "create_new_user"
  Then I should see the user created successfully
  And I navigate to '/admin/people'
  Then I should see user "Test-User" in people page
  Then I logout of the application

@regression_be @core_custom
Scenario: Admin deletes the newly created user
  When I navigate to "/admin/people"
  And I search for user "Test-User"
  And I click edit for user "Test-User"
  And I click on Cancel account
  And I select "Delete the account and its content. This action cannot be undone." option
  And I confirm the user deletion
  And I should not see user "Test-User" in people page

Scenario: Validate up to 5 redirects from redirects admin page
  When I open the redirects admin page
  Then I validate the first 5 From To redirects

@regression_be @core_custom
Scenario: Verify clicking on main icon redirects to homepage 
  When I click on main icon
  Then I should be directed to homepage

@regression_be @core_custom
Scenario: Verify header & fotter menu navigation
  When I click on menu in header
  Then I should be directed to the page 

Scenario: DB logs page visibility 
  When I navigate to the DB logs page
  Then the DB logs page should be "visible"