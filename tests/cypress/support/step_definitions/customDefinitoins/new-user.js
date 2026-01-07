const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');
import * as selectors from "../../step_definitions/mappings-importer";


Then('I click on {string}', (selector) => {
  cy.get(selectors[selector])
    .filter(':visible')
    .first()
    .click();
});

Then('I enter the user details', ()=>{
 cy.get(selectors.drupal_add_user_email_field)
    .should('be.visible')
    .type('test@specbee.com');

  cy.get(selectors.drupal_add_user_username_field)
    .should('be.visible')
    .type('Test-User');

  cy.get(selectors.drupal_add_user_password_field)
    .should('be.visible')
    .type('Test@12345')
    .blur();

    cy.get(selectors.drupal_add_user_confirm_password_field, { timeout: 1000 })
    .should('be.visible')
    .type('Test@12345');

 cy.get('body').then(($body) => {

    if ($body.find(selectors.company_field).length) {
      cy.get(selectors.company_field).type('Specbee');
    }

    if ($body.find(selectors.street_address_field).length) {
      cy.get(selectors.street_address_field).type('123 Test Street');
    }

    if ($body.find(selectors.city_field).length) {
      cy.get(selectors.city_field).type('New York');
    }

    if ($body.find(selectors.state_field).length) {
      cy.get(selectors.state_field).select('New York');
    }

    if ($body.find(selectors.zip_code_field).length) {
      cy.get(selectors.zip_code_field).type('10001');
    }

    if ($body.find(selectors.phone_field).length) {
      cy.get(selectors.phone_field).type('0123');
    }
  });
})

Then('I should see the user created successfully', () => {
  cy.get(selectors.success_message)
    .filter(':visible')
    .should('contain.text', 'Created a new user account');
});

Then('I should see user {string} in people page', (username) => {

  cy.get(selectors.basic_table_locator)
    .filter(':visible')
    .should('exist');

  cy.get(selectors.basic_table_locator)
    .should('contain.text', username);
});

Then('I select user {string} from people page', (username) => {
  cy.visit('/admin/people');

  cy.get(selectors.basic_table_locator)
    .filter(':visible')
    .within(() => {
      cy.contains('td', username)
        .parent('tr')
        .find('input[type="checkbox"]')
        .check();
    });
});

Then('I search for user {string}', (username) => {
  cy.get(selectors.people_search_username_field)
    .filter(':visible')
    .clear()
    .type(username);

  cy.get(selectors.people_filter_button)
    .filter(':visible')
    .click();

  cy.get(selectors.basic_table_locator)
    .should('contain.text', username);
});

Then('I click edit for user {string}', (username) => {
  cy.get(selectors.basic_table_locator)
    .filter(':visible')
    .within(() => {
      cy.contains('td', username)
        .parent('tr')
        .find('a')
        .contains('Edit')
        .click();
    });
});

Then('I click on Cancel account', () => {
  cy.contains('a', 'Cancel account')
    .filter(':visible')
    .click();
});

Then('I select {string} option', (optionText) => {
  cy.contains('label', optionText)
    .should('be.visible')
    .click();
});

Then('I confirm the user deletion', () => {
  cy.get(selectors.confirm_button)
    .filter(':visible')
    .click();
});

Then('I should not see user {string} in people page', (username) => {

  cy.get(selectors.basic_table_locator,{ timeout: 10000 })
    .should('be.visible')
    .and('not.contain.text', username);
});





