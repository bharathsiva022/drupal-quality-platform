Feature: Basic page layout builder

    Background: Admin login
        Given I login to admin dashboard with username 'username' and password 'password'
        When I navigate to '/admin/content'

    @smoke @regression_be @sanity
    Scenario: Adding landing page content
        When I create a "Component Page Builder" with the following details:
            | Field                    | Value                           | FieldType |
            | content_publish_dropdown | Published                       | checkbox  |
            | content_title            | Component Page - layout builder | input     |
            | basic_action_submit      | Save                            | button    |

    @smoke @regression_be @sanity
    Scenario: Adding section to the Component Page Builder content using layout builder
        When I add the section "One column" from edit layout for "Component Page - layout builder"
            | Field                   | Value        | FieldType |
            | add_section_admin_label | Test section | input     |
            | add_section_style       | Grey         | checkbox  |
            | add_section_submit      | Add section  | button    |

    @smoke @regression_be @sanity
    Scenario: Adding "Hero Section" component block to the landing page content using layout builder
        When I edit the content 'Component Page - layout builder' and navigate to layout page
        Then I add the block "Hero Section" to the section index 0 with the details:
            | Field                                   | Value                  | FieldType     |
            | layout_add_media                        | Add media              | button        |
            |                                         | 2000                   | wait          |
            | select_video                            | Video                  | button        |
            |                                         | 2000                   | wait          |
            | search_video                            | INX-Hero-Video-003.mp4 | typeAndsearch |
            |                                         | 3000                   | wait          |
            | headline                                | Testing Hero Banner    | input         |
            | primary_CTA_URL                         | /contact-us            | input         |
            | primary_CTA_Link_text                   | Contact Inx            | input         |
            | secondary_CTA_URL                       | /products              | input         |
            | secondary_CTA_Link_text                 | Product search         | input         |
            | basic_action_submit                     | Add block              | button        |
            | drupal_layoutbuilder_save_layout_button | Save layout            | button        |

        Then I should see the section with title "Testing Hero Banner"
        And I should see the block "component_hero_banner"

    @smoke @regression_be @sanity
    Scenario: Deleting the Component Page - layout builder content
        When I delete the "Component Page - layout builder"
        Then I should not see the "Component Page - layout builder" anymore
        And I should see the message "Component Page - layout builder has been deleted"
        And I logout of the application