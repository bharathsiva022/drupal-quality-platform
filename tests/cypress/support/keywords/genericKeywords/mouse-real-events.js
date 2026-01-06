import * as selectors from '../../step_definitions/mappings-importer';

Cypress.Commands.add('hoverAndCheckMessage', (elementSelector, message, detached = false) => {
  if (!detached) {
    cy.get(selectors[elementSelector])
      .realHover()
      .should('be.visible')
      .and('contain', message);
  } else {
    cy.get(selectors[elementSelector]).trigger('mouseover', { force: true });
    cy.contains(message);
  }
});
