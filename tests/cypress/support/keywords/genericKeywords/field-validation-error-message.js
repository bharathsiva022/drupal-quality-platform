import * as selectors from '../../step_definitions/mappings-importer';

Cypress.Commands.add('checkEmptyInputFieldErrorMessage', (elementSelector, value) => {
  cy.get(selectors[elementSelector]).should('be.visible').clear();
  cy.get('body').click(0, 0);
  cy.get(`#error_${selectors[elementSelector].slice(1)}`)
    .should('be.visible')
    .and('contain', value);
});

Cypress.Commands.add('checkInvalidInputFieldErrorMessage', (value, elementSelector, message) => {
  cy.get(selectors[elementSelector]).should('be.visible').type(value);
  cy.get('body').click(0, 0);
  cy.get(`#error_${selectors[elementSelector].slice(1)}`)
    .should('be.visible')
    .and('contain', message);
});

