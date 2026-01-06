import * as selectors from '../../step_definitions/mappings-importer';

Cypress.Commands.add('slideRight', (elementSelector, value) => {
    cy.get(selectors[elementSelector]).click({ multiple: true, force: true });
    cy.get(selectors[elementSelector]).type('{shift}{rightarrow}'.repeat(value));
  });
  
  Cypress.Commands.add('slideLeft', (elementSelector, value) => {
    cy.get(selectors[elementSelector]).click({ multiple: true, force: true });
    cy.get(selectors[elementSelector]).type('{shift}{leftarrow}'.repeat(value));
  });
  