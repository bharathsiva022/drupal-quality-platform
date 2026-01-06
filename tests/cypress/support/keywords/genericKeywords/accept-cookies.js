Cypress.Commands.add('acceptCookies', () => {
  cy.get('body').then(($body) => {
    // Check if the cookie banner exists and is visible
    if ($body.find('.eu-cookie-compliance-banner').length) {
      cy.get('.eu-cookie-compliance-banner').should('be.visible');
      cy.get('.agree-button', { timeout: 2000 })
        .should('be.visible')
        .click();
    }
  });
});
