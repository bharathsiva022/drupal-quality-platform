import * as selectors from '../../step_definitions/mappings-importer';

Cypress.Commands.add('selectFromDropdown', (assertionValue, elementSelector) => {
  cy.get(selectors[elementSelector]).select(assertionValue);
});

Cypress.Commands.add('selectFromDetachedDropdown', (assertionValue, elementSelector) => {
  cy.wait(5000);
  cy.get(selectors[elementSelector]).select(assertionValue, { force: true });
});

Cypress.Commands.add('selectValueFromDropdown', (value, elementSelector) => {
  cy.wait(500);
  cy.get(selectors[elementSelector]).select(value).should('have.value', value);
});

Cypress.Commands.add('selectOptionFromDropdown', (value, elementSelector) => {
  cy.wait(500);
  cy.get(selectors[elementSelector]).select(value);
});
