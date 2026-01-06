import * as selectors from '../../step_definitions/mappings-importer';

Cypress.Commands.add('checkFieldContainsClass', (elementSelector, assertionValue) => {
  cy.get(selectors[elementSelector])
    .scrollIntoView()
    .should((element) => {
      expect(element).to.have.class(selectors[assertionValue]);
    });
});

Cypress.Commands.add('checkFieldNotContainClass', (elementSelector, assertionValue) => {
  cy.get(selectors[elementSelector]).should((element) => {
    expect(element).not.to.have.class(selectors[assertionValue]);
  });
});

