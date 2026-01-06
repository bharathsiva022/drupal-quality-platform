Cypress.Commands.add('verifyCookie', (cookieName, cookieValue) => {
    cy.getCookie(cookieName)
      .should('exist')
      .should('have.property', 'value', cookieValue);
  });
  