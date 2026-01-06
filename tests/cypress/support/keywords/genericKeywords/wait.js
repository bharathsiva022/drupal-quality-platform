import * as selectors from '../../step_definitions/mappings-importer';

Cypress.Commands.add('applyWait', (elementSelector) => {
    cy.get(selectors[elementSelector], { timeout: 10000 }).should('be.visible');
  });
  
  Cypress.Commands.add('cypressWait', () => {
    cy.wait(10000);
  });
  
  Cypress.Commands.add('cypressWait2', () => {
    cy.wait(30000);
  });
  
  Cypress.Commands.add('customWait', (waitTimeInSeconds) => {
    const waitTimeInMilliseconds = waitTimeInSeconds * 1000;
    cy.wait(waitTimeInMilliseconds);
  });
  