Feature: Managing Taxonomy Terms in UHG

    Background: Admin login
        Given I login to admin dashboard with username 'username' and password 'password'

    @smoke @regression_be @sanity
    Scenario Outline: Manage Taxonomy Terms for <Taxonomy>
        When I navigate to '/admin/structure/taxonomy'
        And I create a term with the name "<TermName>" and description "<Description>" for the vocabulary "<Taxonomy>"
        Then I should see the message "Created new term <TermName>."
        Then I should see the term "<TermName>" in the list of "<Taxonomy>" vocabulary
        When I edit the term "<TermName>" to "<UpdatedTermName>"
        Then I should see the updated term "<UpdatedTermName>" in the list of "<Taxonomy>" vocabulary
        When I delete the term "<UpdatedTermName>" from the "<Taxonomy>" vocabulary
        Then I should see the message "Deleted term <UpdatedTermName>."
        Then I should not see the term "<UpdatedTermName>" anymore
        And I logout of the application
        Examples:
            | Taxonomy        | TermName      | Description             | UpdatedTermName      |
            | Blog Categories | News Category | This is a news category | Updated Category     |
            | Support         | Support Tag   | Tag used for support    | Updated support Tag  |
