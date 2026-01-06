Feature: Manage Menu

    Background:
        Given I login to admin dashboard with username 'username' and password 'password'

    @smoke @regression_be @sanity
    Scenario Outline: I create a new menu <menu_title>
        And I create a menu with name "<menu_title>" and admin summary "<administrative_summary>"
        Then I should see the message "Menu <menu_title> has been added."
        When I navigate to "/admin/structure/menu"
        Then the menu "<menu_title>" should be visible in the "menu_list"
        Examples:
            | menu_title                | administrative_summary                        |
            | Main Navigation - Test    | Main site navigation menu for testing         |
            | Footer Links - Test       | Links for the footer section for testing      |
            | Sidebar Navigation - Test | Sidebar-specific navigation links for testing |

    @smoke @regression_be @sanity
    Scenario Outline: Menu link CRUD operations
        When I navigate to "/admin/structure/menu"
        Then the menu "<menu_title>" should be visible in the "menu_list"
        When I click on "Edit menu" next to the menu "<menu_title>"
        And I click on "menu_add_link" button
        And I enter "<link_title>" as the link title
        And I enter "<link_path>" as the link path
        And I select "<parent_link>" as the parent link
        And I click on "basic_action_save" button
        Then I should see the message "The menu link has been saved."
        And the link "<link_title>" should be visible for the menu "<menu_title>"
        When I edit menu link "<link_title>" title to "<link_title_updated>" and link path to "<link_path_updated>"
        Then I should see the message "The menu link has been saved."
        And the link "<link_title_updated>" should be visible for the menu "<menu_title>"
        Then I delete the menu link "<link_title_updated>"
        Then I should see the message "The menu link <link_title_updated> has been deleted."
        Examples:
            | menu_title                | link_title            | link_path        | parent_link                 | link_title_updated            | link_path_updated |
            | Main Navigation - Test    | Home - Test           | /home1           | <Main Navigation - Test>    | Home - Test updated           | /homepage1         |
            | Sidebar Navigation - Test | About Us - Test       | /about1          | <Sidebar Navigation - Test> | About Us - Test updated       | /about-us1        |
            | Footer Links - Test       | Privacy Policy - Test | /privacy-policy1 | <Footer Links - Test>       | Privacy Policy - Test updated | /privacy-policy1   |

    @smoke @regression_be @sanity
    Scenario: Edit an existing menu
        When I navigate to "/admin/structure/menu"
        Then the menu "Main Navigation - Test" should be visible in the "menu_list"
        When I click on "Edit menu" next to the menu "Main Navigation - Test"
        And I change the menu name to "Main Navigation - Test updated"
        And I click on "basic_action_save" button
        Then I should see the message "Menu Main Navigation - Test updated has been updated."
        When I navigate to "/admin/structure/menu"
        Then the menu "Main Navigation - Test updated" should be visible in the "menu_list"

    @smoke @regression_be @sanity
    Scenario Outline: Delete the menu item <menu_title>
        When I navigate to "/admin/structure/menu"
        Then the menu "<menu_title>" should be visible in the "menu_list"
        And I delete the menu item "<menu_title>"
        Then I should see the message "The menu <menu_title> has been deleted."
        And the menu "<menu_title>" should not be visible in the "menu_list"
        Examples:
            | menu_title                     |
            | Main Navigation - Test updated |
            | Footer Links - Test            |
            | Sidebar Navigation - Test      |