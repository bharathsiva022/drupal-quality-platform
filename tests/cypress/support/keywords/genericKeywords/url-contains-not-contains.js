Cypress.Commands.add('checkURLContains', (assertionValue) => {
  cy.url().should('contain', Cypress.env(assertionValue) || assertionValue);
});

Cypress.Commands.add('checkURLNotContains', (assertionValue) => {
  cy.url().should('not.contain', Cypress.env(assertionValue) || assertionValue);
});

Cypress.Commands.add('modifyURL', (assertionValue) => {
  cy.url().then((url) => {
    cy.visit(url + (Cypress.env(assertionValue) || assertionValue));
  });
});
