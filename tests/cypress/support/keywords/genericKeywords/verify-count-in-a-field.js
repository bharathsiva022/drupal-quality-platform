import * as selectors from '../../step_definitions/mappings-importer';

Cypress.Commands.add('verifyCountLessThanOrEqual', (elementSelector, maxCount) => {
    maxCount = parseInt(maxCount); // Convert maxCount to a number
    cy.get(selectors[elementSelector])
      .should('be.visible')
      .its('length')
      .should('be.lte', maxCount); // lte is less than or equal to
  });
  
  Cypress.Commands.add('verifyCountGreaterThanOrEqual', (elementSelector, minCount) => {
    minCount = parseInt(minCount); // Convert minCount to a number
    cy.get(selectors[elementSelector])
      .should('be.visible')
      .its('length')
      .should('be.gte', minCount); // gte is greater than or equal to
  });
  