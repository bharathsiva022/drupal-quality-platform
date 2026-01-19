Feature: Drupal Regression Checks 
  Background: Admin login
    Given I login to admin dashboard with username 'username' and password 'password'
    
@regression_be @drupal_checks
Scenario: Creating New User
  When I navigate to '/admin/people'  
  Then I click on "Add_user"  
  Then I enter the user details
  Then I click on "create_new_user"
  Then I should see the user created successfully
  And I navigate to '/admin/people'
  Then I should see user "Test-User" in people page
  Then I logout of the application

@regression_be @drupal_checks
Scenario: Admin deletes the newly created user
  When I navigate to "/admin/people"
  And I search for user "Test-User"
  And I click edit for user "Test-User"
  And I click on Cancel account
  And I select "Delete the account and its content. This action cannot be undone." option
  And I confirm the user deletion
  And I should not see user "Test-User" in people page

@regression_be @drupal_checks
Scenario: Validate url redirects from admin page
  When I open the redirects admin page
  Then I validate url redirects

@regression_be @drupal_checks
Scenario: Verify clicking on main icon redirects to homepage 
  When I click on main icon
  Then I should be directed to homepage

@regression_be @drupal_checks
Scenario: Verify header & fotter menu navigation
  When I click on menu in header
  Then I should be directed to the page 

Scenario: DB logs page visibility
  When I navigate to the DB logs page
  Then the DB logs page visibility should match the environment

@regression_be @drupal_checks
Scenario: Verify correct upload media limit is configured
  When I navigate to "/media/add/document"
  Then I should see 100 MB media upload limit 

@regression_be @drupal_checks
Scenario: Verify unpublished content is not visible to anonymous users
  When I navigate to "/testing-page-1" as admin user
  Then I logged the page should be visible for admin
  Then I logout of the application
  Then I navigate to "/testing-page-1" as anonymous user
  Then I should not see the content

@regression_be @drupal_checks
Scenario: Verify if css and js aggregators are enabled 
  When I navigate to "/admin/config/development/performance"
  Then Both css and js aggregators should be checked 

@regression_be @drupal_checks
Scenario: Verify g tag configuration based on environment
  When I navigate to "/"
  Then g tag should be configured correctly for the environment

@regression_be @drupal_checks
Scenario: Verify sitemap.xml is configured
  When I request "/sitemap.xml"
  Then the system file "sitemap" should be configured

@regression_be @drupal_checks
Scenario: Verify robots.txt is configured
  When I request "/robots.txt"
  Then the system file "robots" should be configured
  
@regression_be @drupal_checks
Scenario: Verify metatag is configured
  When I navigate to "/"
  Then I verify metatags should be configured