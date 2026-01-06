const {
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");
import * as selectors from "../mappings-importer";



When('I enter the following product details:', (dataTable) => {
  cy.fillForm(dataTable);
});

When('I should see the product code {string} in the cart', (productCode) => {

  cy.get(selectors.cart_summary).should('contain', productCode);
  
});

Then('I enter the credit card details:', (dataTable) => {
  cy.contains('a, button', 'Proceed to checkout').click();
  cy.document().then((doc) => {
    const el = doc.querySelector(selectors.credit_card_number); 

  if (el && Cypress.$(el).is(':visible')) {
    cy.fillForm(dataTable);
    
  }
});

});

Then('I navigate to the Shipping and Billing page and fill in the following details:', (dataTable) => {
  const formFields = dataTable.hashes();
  cy.document().then((doc) => {
    const el = doc.querySelector(selectors.purchasing_form_firstName); 

  if (el && Cypress.$(el).is(':visible')) {
    cy.fillForm(dataTable);
    cy.get(selectors.continue_to_review).scrollIntoView()
          .should("be.visible")
          .click({force: true});

  }else{
        cy.get(selectors.continue_to_review).scrollIntoView()
          .should("be.visible")
          .click({force: true});
  }
});

});

Then('I should see the order summary page with:', (dataTable) => {
  cy.wait(1000)
  const expected = dataTable.hashes()[0]; 
  const { 'Product Code': code, 'Product Name': name, 'Quantity': qty } = expected;

  cy.get(selectors.order_summary) 
    .should('contain', code)
    .and('contain', name)
    .and('contain', qty);
});

Then('I click the {string} button', (btnText) => {
  cy.get(selectors[btnText]).click();
});

