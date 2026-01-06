Feature: INX product purchasing process

  Background: Admin login
    Given I login to admin dashboard with username 'username' and password 'password'

  @regression_fe
  Scenario: User successfully purchases a product
    When I navigate to '/buy-swatch'
    And I enter the following product details:
      | Field            | Value   | FieldType |
      | swatch_number    | 1309786 | input     |
      | product_quantity | 2       | select    |
      | add_to_cart      |         | button    |

    Then I should see the message "Gray Opaque added to your cart"
    And I navigate to "/cart"
    And I should see the product code "1309786" in the cart

    When I enter the credit card details:
      | Field              | Value           | FieldType |
      | credit_card_month  | 05              | input     |
      | credit_card_year   | 27              | input     |
      | credit_card_cvv    | 123             | input     |
      | credit_card_number | 378282246310005 | input     |

    And I navigate to the Shipping and Billing page and fill in the following details:
      | Field                       | Value      | FieldType |
      | purchasing_form_firstName   | Test       | input     |
      | purchasing_form_lastName    | Automation | input     |
      | purchasing_form_company     | Specbee    | input     |
      | purchasing_form_address     | Test       | input     |
      | purchasing_form_phoneNumber | 9000000000 | input     |
      | purchasing_form_country     | India      | select    |
      |                             | 2000       | wait      |
      | purchasing_form_city        | Bengaluru  | input     |
      | purchasing_form_postalCode  | 000000     | input     |
      | purchasing_form_state       | Karnataka  | select    |
      |                             | 2000       | wait      |

    Then I should see the order summary page with:
      | Product Code | Product Name | Quantity |
      | 1309786      | Gray Opaque  | 2        |

    When I click the "payAndCompletePurchase" button
    Then I should see the message "Payment Confirmed"
