import * as selectors from '../../step_definitions/mappings-importer';

Cypress.Commands.add('verifyTitles', (selector, dataTable) => {
    const expectedTitles = dataTable.rawTable.slice(1).map((row) => row[0]);
    cy.get(selectors[selector])
      .should('have.length', expectedTitles.length)
      .each(($title, index) => {
        cy.wrap($title)
          .scrollIntoView()
          .should('be.visible')
          .invoke('text')
          .should('eq', expectedTitles[index]);
      });
  });
  
  Cypress.Commands.add('clickTitlesAndValidateURLs', (selector, dataTable) => {
    const urls = dataTable.rawTable.slice(1).map((row) => row[0]);
    urls.forEach((url, index) => {
      cy.get(selectors[selector])
        .eq(index)
        .scrollIntoView()
        .should('be.visible')
        .invoke('attr', 'target', '_self')
        .should('have.attr', 'target', '_self')
        .click();
      cy.url().should('include', url);
      cy.go('back');
    });
  });
  