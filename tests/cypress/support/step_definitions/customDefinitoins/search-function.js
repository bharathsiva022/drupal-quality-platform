const {
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");
import * as selectors from "../mappings-importer";


When('I enter {string} in the search bar', (keyword) => {
  cy.get(selectors.search_field) 
    .clear()
    .type(keyword);
});


When('I click on the search button', () => {
  cy.get(selectors.search_button).click(); 
});


Then('I should see search results related to {string}', (keyword) => {
  cy.get(selectors.search_results) 
    .should('be.visible')
    .and('contain.text', keyword);
});

When('I click the search button without entering a search term',()=>{
  cy.get(selectors.search_field) .clear()
  cy.get(selectors.search_button).click();
});