Feature: CKEditor Functionality

  Background: 
    Given I login to admin dashboard with username 'username' and password 'password'
    When I navigate to '/admin/content'

  @smoke @regression_be @sanity
  Scenario: Create a article to test CK Editor functionalities
    When I create a "Article" with the following details:
      | Field                    | Value                           | FieldType |
      | content_title            | Testing Ck editor               | input     |
      | content_description      | /htmlTestData/contentdescr.html | ckeditor  |
      | basic_action_submit      | Save                            | button    |

  @smoke @regression_be @sanity
  Scenario: Validate Bold text content in CKEditor
    When I edit the CKEditor in content "Testing Ck editor"
    And I apply formatting "bold" and type in "Testing bold content"
    Then I save basic page "Testing Ck editor" and validate the content "Testing bold content" format is 'bold'

  @smoke @regression_be @sanity
  Scenario: Validate Italic text content in CKEditor
    When I edit the CKEditor in content "Testing Ck editor"
    And I apply formatting "italic" and type in "Testing italic content"
    Then I save basic page "Testing Ck editor" and validate the content "Testing italic content" format is 'italic'

  @smoke @regression_be @sanity
  Scenario: Validate Link content in CKEditor
    When I edit the CKEditor in content "Testing Ck editor"
    And I apply formatting "link" and type in "google.com"
    Then I save basic page "Testing Ck editor" and validate the content "google.com" format is 'link'

  @smoke @regression_be @sanity
  Scenario: Validate Bulleted list content in CKEditor
    When I edit the CKEditor in content "Testing Ck editor"
    And I apply formatting "bulleted" and type in "/htmlTestData/bulletedList.html" from fixture
    Then I save basic page "Testing Ck editor" and validate the content "/htmlTestData/bulletedList.html" format is 'bulleted'

  @smoke @regression_be @sanity
  Scenario: Validate Numbered list content in CKEditor
    When I edit the CKEditor in content "Testing Ck editor"
    And I apply formatting "numbered" and type in "/htmlTestData/numberedList.html" from fixture
    Then I save basic page "Testing Ck editor" and validate the content "/htmlTestData/numberedList.html" format is 'numbered'

  @smoke @regression_be @sanity
  Scenario: Validate Upload Image content in CKEditor
    When I edit the CKEditor in content "Testing Ck editor"
    And I click insert media "world all.png"
    Then I save basic page "Testing Ck editor" and validate the content "world all.png" format is 'image'

  @smoke @regression_be @sanity
  Scenario Outline: Validate the headings "<heading>" and paragraph in Ckeditor
    When I edit the CKEditor in content "Testing Ck editor"
    And I select "<heading>" and insert text "<headingText>"
    Then I save basic page "Testing Ck editor" and I should see the contents "<headingText>" in the frontend with their respective "<tag>"
    Examples:
      | heading   | tag | headingText         |
      | Heading 2 | h2  | This is a heading 2 |
      | Heading 3 | h3  | This is a heading 3 |
      | Heading 4 | h4  | This is a heading 4 |
      | Heading 5 | h5  | This is a heading 5 |
      | Heading 6 | h6  | This is a heading 6 |
      | Paragraph | p   | This is a paragraph |

  @smoke @regression_be @sanity
  Scenario: Validate the Horizontal line in Ckeditor
    When I edit the CKEditor in content "Testing Ck editor"
    And I enter some data "This is dummy data" and after that select "Horizontal line"
    Then I should see the Horizontal line after the content "This is dummy data" in the frontend for the content "Testing Ck editor"
  
  @smoke @regression_be @sanity
  Scenario: Delete the basic page created
    When I delete the "Testing Ck editor"