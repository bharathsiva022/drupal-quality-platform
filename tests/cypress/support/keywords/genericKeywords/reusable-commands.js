Cypress.Commands.add('visitPage', (path) => {
    cy.visit(path, {failOnStatusCode: false});
    cy.get('body').should('be.visible');
  });
  
  Cypress.Commands.add('checkNoPhpError', () => {
    const errors = ['Fatal error', 'Uncaught', 'Drupal\\Core', 'PDOException'];
    errors.forEach(err => cy.contains(err).should('not.exist'));
  });
  
  Cypress.Commands.add('hoverOnElement', (selector) => {
    cy.get(selector).trigger('mouseover');
  });
  
  Cypress.Commands.add('clickElement', (selector) => {
    cy.get(selector).click({force: true});
  });
  
  Cypress.Commands.add('assertCssProperty', (selector, property, value) => {
    cy.get(selector).should('have.css', property).and('include', value);
  });
  
  Cypress.Commands.add('setResponsiveViewport', (width, height) => {
    cy.viewport(width, height);
  });

  Cypress.Commands.add('checkNoJsError', () => {
  cy.window().then((win) => {
    const errors = win.console.error.calls?.all() || [];
    if (errors.length > 0) {
      throw new Error('JavaScript errors found in console: ' + JSON.stringify(errors));
    }
  });
});