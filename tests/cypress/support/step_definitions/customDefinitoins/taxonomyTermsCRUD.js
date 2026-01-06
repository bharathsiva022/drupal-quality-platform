const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');
import * as selectors from "../mappings-importer";


When('I select the {string} vocabulary', (vocabulary) => {
  cy.get(selectors.taxonomyTable).contains(vocabulary).closest('tr').within(() => {
    cy.get('a').contains('List terms').click();
  });
});

When('I create a term with the name {string} and description {string} for the vocabulary {string}', (termName, description, vocabulary) => {
  cy.createTaxonomyTerm(vocabulary, termName, description)
});

Then('I should see the term {string} in the list of {string} vocabulary', (termName, vocabulary) => {
  cy.get(selectors.taxonomyTable).contains(termName).should('be.visible');
});

Then('I should see the updated term {string} in the list of {string} vocabulary', (termName, vocabulary) => {
  cy.contains(termName).should('be.visible');
});

When('I edit the term {string} to {string}', (oldTermName, newTermName) => {
cy.editTaxonomyTerm(oldTermName, newTermName)
});

When('I delete the term {string} from the {string} vocabulary', (termName, vocabulary) => {
  cy.deleteTaxonomyTerm(termName);
});

Then('I should not see the term {string} anymore', (termName) => {
  cy.get(selectors.taxonomyTable).contains(termName).should('not.exist');
});
