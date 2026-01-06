Cypress.Commands.add('goBackOnePage', () => {
  cy.go('back');
});

Cypress.Commands.add('goForwardOnePage', () => {
  cy.go('forward');
});

