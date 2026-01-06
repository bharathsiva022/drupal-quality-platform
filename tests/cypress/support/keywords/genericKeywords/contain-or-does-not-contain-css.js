import * as selectors from '../../step_definitions/mappings-importer';

Cypress.Commands.add('checkFieldContainsCSS', (elementSelector, css, assertionValue) => {
  cy.get(selectors[elementSelector])
    .scrollIntoView()
    .should((element) => {
      expect(element).to.have.css(css, assertionValue);
    });
});

Cypress.Commands.add('checkFieldNotContainCSS', (elementSelector, css, assertionValue) => {
  cy.get(selectors[elementSelector])
    .should((element) => {
      expect(element).not.to.have.css(css, assertionValue);
    });
});
