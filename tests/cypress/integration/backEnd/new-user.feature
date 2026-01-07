Feature: Creating New User as Admin
  Background: Admin login
    Given I login to admin dashboard with username 'username' and password 'password'
    
@regression_be @core_custom
Scenario: Creating New User
  When I navigate to '/admin/people'    Then I click on "Add_user"
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
