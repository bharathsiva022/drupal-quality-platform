import * as selectors from '../../step_definitions/mappings-importer';

Cypress.Commands.add('checkButtonDisabled', (elementSelectorKey, shouldBeDisabled) => {
  if (shouldBeDisabled) {
    cy.get(selectors[elementSelectorKey]).should('be.disabled');
  } else {
    cy.get(selectors[elementSelectorKey]).should('not.be.disabled');
  }
});

