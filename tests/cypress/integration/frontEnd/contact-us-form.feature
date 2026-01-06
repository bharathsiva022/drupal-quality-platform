Feature: INX contact us form
    Background: Admin login
        Given I login to admin dashboard with username 'username' and password 'password'

    @regression_fe
    Scenario: Submit contact form with valid data
        When I navigate to '/contact'
        Then I fill in the contact form with the following details:
            | Field                               | Value                           | FieldType |
            | contact_form_firstName              | Testing                         | input     |
            | contact_form_secondName             | Automation                      | input     |
            | contact_form_job_title              | QA                              | input     |
            | contact_form_company                | Specbee                         | input     |
            | contact_form_market_segment         | Pad Printing                    | select    |
            | contact_form_email                  | testing@example.com             | input     |
            | contact_form_phone_number           | +91 9000000000                  | input     |
            | contact_form_country                | India                           | select    |
            |                                     | 2000                            | wait      |
            | contact_form_address                | India                           | input     |
            | contact_form_city                   | Test                            | input     |
            | contact_form_state                  | Test                            | input     |
            | contact_form_postalCode             | 000000                          | input     |
            | contact_form_type_of_product        | Ink-Pad                         | select    |
            | contact_form_immediate_product_need | Yes, 0-6 months                 | select    |
            | contact_form_message                | This is a test msg.Ignore this. | input     |
            | contact_form_submit                 |                                 | button    |

        Then I should see the message "Your submission has been received"
        And I logout of the application
