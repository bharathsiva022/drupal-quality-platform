Feature: INX Content Type CRUD operations
  Background: Admin login
    Given I login to admin dashboard with username 'username' and password 'password'
    
  @smoke @regression_be @sanity @CRUD
  Scenario: Component page builder create operation
    When I navigate to '/admin/content'
    And I create a "Component Page Builder" with the following details:
      | Field                    | Value                             | FieldType |
      | content_publish_dropdown | Published                         | checkbox  |
      | content_title            | Inx - Test component page builder | input     |
      | basic_action_submit      | Save                              | button    |
    Then I should see a success message "Component Page Builder Inx - Test Component page builder has been created"
    And I should see the "Inx - Test component page builder" in the page title
    And I capture the page url as 'Component Page Builder'
    And I navigate to '/admin/content'
    Then I should see the test page "Inx - Test component page builder" in the content table
    And I logout of the application

  @smoke @regression_be @sanity @CRUD
  Scenario: Component page builder edit operation
    When I navigate to '/admin/content'
    And I edit the "Component Page Builder" with the details:
      | Field               | Value                                        | FieldType |
      | content_title       | Inx - Test component page builder updated    | input     |
      | basic_action_submit | Save                                         | button    |
    Then I should see a edit success message "Component Page Builder Inx - Test component page builder updated has been updated"
    And I capture the page url as 'componentPageBuilderUpdated'
    And I navigate to '/admin/content'
    Then I should see the test page "Inx - Test component page builder" in the content table
    And I logout of the application

  @smoke @regression_be @sanity @CRUD
  Scenario: Component page builder delete operation
    When I navigate to '/admin/content'
    When I delete the "Inx - Test component page builder updated"
    Then I should not see the "Inx - Test component page builder updated" anymore
    Then I logout of the application

  @smoke @regression_be @sanity @CRUD
  Scenario: Products create operation
    When I navigate to '/admin/content'
    And I create a "Products" with the following details:
      | Field                               | Value                              | FieldType |
      | content_title                       | Inx - Test products                | input     |
      | content_products_body               | /htmlTestData/product.html         | ckeditor  |
      | content_add_media                   | Add media                          | button    |
      |                                     | 1000                               | wait      |
      | content_image_upload                | \mediaTestData\Image_Container.png | file      |
      | content_article_image_alt_text      | Test image                         | input     |
      | content_image_Save_button           |                                    | button    |
      |                                     | 5000                               | wait          |
      | basic_action_submit                 | Save                               | button    |

    Then I should see a success message "Products Inx - Test products has been created."
    And I should see the "Inx - Test products" in the page title
    And I capture the page url as 'products'
    And I navigate to '/admin/content'
    Then I should see the test page "Inx - Test products" in the content table
    And I logout of the application

  @smoke @regression_be @sanity @CRUD
  Scenario: Products edit operation
    When I navigate to '/admin/content'
    And I edit the "Inx - Test products" with the details:
      | Field               | Value                          | FieldType |
      | content_title       | Inx - Test products Updated    | input     |
      | basic_action_submit | Save                           | button    |
    Then I should see a edit success message "Products Inx - Test products Updated has been updated."
    And I capture the page url as 'productsUpdated'
    And I navigate to '/admin/content'
    Then I should see the test page "Inx - Test products Updated" in the content table
    And I logout of the application

  @smoke @regression_be @sanity @CRUD
  Scenario: Products delete operation
    When I navigate to '/admin/content'
    When I delete the "Inx - Test products Updated"
    Then I should not see the "Inx - Test products Updated" anymore
    Then I logout of the application

  @smoke @regression_be @sanity @CRUD
  Scenario: Blog create operation
    When I navigate to '/admin/content'
    And I create a "Blog" with the following details:
      | Field                          | Value                                       | FieldType     |
      | content_title                  | Inx - Test Blog                             | input         |
      | content_blog_title             | Beyond Color: Tactile and Haptic Coatings   | input         |
      | content_blog_subtitle          | /htmlTestData/blogSubtitle.html             | ckeditor      |
      | content_blog_body              | /htmlTestData/blogContent.html              | ckeditor      |
      | content_blog_add_media         | Add media                                   | button        |
      |                                | 1000                                        | wait          |
      | content_image_upload           | \mediaTestData\testimage1.png               | file          |
      | content_article_image_alt_text | Test image                                  | input         |
      | content_doc_Save_button        | Save                                        | button        |
      | media_insert_selected          | Insert selected                             | button        |
      |                                | 2000                                        | wait          |
      | content_blog_catagory          | Shelf Appeal                                | select        |
      | content_blog_related_article   | How Coatings and Varnishes Can Improve Your Printed Packaging                | typeAndSelect |
      | content_blog_tag               | Tactile Effect                              | typeAndSelect |
      | basic_action_submit            | Save                                        | button        |

    Then I should see a success message "Blog Inx - Test Blog has been created"
    And I should see the "Inx - Test Blog" in the page title
    And I capture the page url as 'inxBlog'
    And I navigate to '/admin/content'
    Then I should see the test page "Inx - Test Blog" in the content table
    When I logout of the application

  @smoke @regression_be @sanity @CRUD
  Scenario: Blog edit operation
    When I navigate to '/admin/content'
    And I edit the "Inx - Test Blog" with the details:
      | Field               | Value                          | FieldType |
      | content_title       | Inx - Test Blog Updated        | input     |
      | basic_action_submit | Save                           | button    |
    Then I should see a edit success message "Blog Inx - Test Blog Updated has been updated."
    And I capture the page url as 'inxBlogUpdated'
    And I navigate to '/admin/content'
    Then I should see the test page "Inx - Test Blog Updated" in the content table
    And I logout of the application

   @smoke @regression_be @sanity @CRUD
  Scenario: Blog delete operation
    When I navigate to '/admin/content'
    When I delete the "Inx - Test Blog Updated"
    Then I should not see the "Inx - Test Blog Updated" anymore
    Then I logout of the application

  @smoke @regression_be @sanity @CRUD
  Scenario: INX News create operation
    When I navigate to '/admin/content'
    And I create a "INX News" with the following details:
      | Field                    | Value                             | FieldType |
      | content_title            | Inx - Test News                   | input     |
      | content_news_body        | /htmlTestData/newsBody.html       | ckeditor  |
      | content_news_date        | 10/12/2025                        | date      |
      | content_publish_dropdown | Published                         | checkbox  |
      | basic_action_submit      | Save                              | button    |
    Then I should see a success message "INX News Inx - Test News has been created."
    And I should see the "Inx - Test News" in the page title
    And I capture the page url as 'inxNews'
    And I navigate to '/admin/content'
    Then I should see the test page "Inx - Test News" in the content table
    And I logout of the application

  @smoke @regression_be @sanity @CRUD
  Scenario: INX News edit operation
    When I navigate to '/admin/content'
    And I edit the "Inx - Test News" with the details:
      | Field               | Value                          | FieldType |
      | content_title       | Inx - Test News Updated        | input     |
      | basic_action_submit | Save                           | button    |
    Then I should see a edit success message "INX News Inx - Test News Updated has been updated."
    And I capture the page url as 'inxNewsUpdated'
    And I navigate to '/admin/content'
    Then I should see the test page "Inx - Test News Updated" in the content table
    And I logout of the application

  @smoke @regression_be @sanity @CRUD
  Scenario: INX News delete operation
    When I navigate to '/admin/content'
    When I delete the "Inx - Test News"
    Then I should not see the "Inx - Test News Updated" anymore
    Then I logout of the application