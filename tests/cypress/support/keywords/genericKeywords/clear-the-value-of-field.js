import * as selectors from '../../step_definitions/mappings-importer';

Cypress.Commands.add("clearField", (elementSelectorKey) => {
  cy.get(selectors[elementSelectorKey]).clear();
});

Cypress.Commands.add("clearAllPillsInSection", (elementSelector) => {
  cy.get(selectors[elementSelector]).each((el) => {
    cy.wrap(el).click();
  });
});

Cypress.Commands.add("clearHiddenField", (elementSelectorKey) => {
  cy.get(selectors[elementSelectorKey]).clear({ force: true });
});

Cypress.Commands.add('clearFields', (dataTable) => {
  dataTable.hashes().forEach((elem) => {
    if (elem.fieldType === 'input' || elem.fieldType === 'div') {
      cy.get(selectors[elem.field]).clear();
      cy.get(selectors[elem.field]).realPress('Tab');
    } else if (elem.fieldType === 'select') {
      //press tab to select the dropdown field
      cy.get(selectors[elem.field]).select(elem.Value);
      cy.get(selectors[elem.field]).realPress('Tab');
    }
  });
});

Cypress.Commands.add('uncheckChecboxes', (dataTable) => {
  dataTable.hashes().forEach((elem) => {
    if (elem.fieldType === 'checkbox') {
      elem.Value
        ? cy.get(selectors[elem.field]).check(elem.Value).should('be.checked')
        : cy.get(selectors[elem.field]).check().should('be.checked');
    }
  });
});