import * as selectors from '../../step_definitions/mappings-importer';

Cypress.Commands.add("checkCheckbox", (elementSelector) => {
  cy.get(selectors[elementSelector]).scrollIntoView().check();
});

Cypress.Commands.add("uncheckCheckbox", (elementSelector) => {
  cy.get(selectors[elementSelector]).scrollIntoView().uncheck();
});

Cypress.Commands.add("checkCheckboxAtIndex", (number, elementSelector) => {
  cy.get(selectors[elementSelector])
    .eq(number)
    .scrollIntoView()
    .check({ force: true });
});

Cypress.Commands.add("uncheckCheckboxAtIndex", (number, elementSelector) => {
  cy.get(selectors[elementSelector])
    .eq(number)
    .scrollIntoView()
    .uncheck({ force: true });
});

Cypress.Commands.add("checkCheckboxesAtIndexes", (indexes, elementSelector) => {
  const indexArr = indexes.split(",").map(Number);

  indexArr.forEach((index) => {
    cy.get(selectors[elementSelector])
      .eq(index)
      .scrollIntoView()
      .check({ force: true });
  });
});

Cypress.Commands.add(
  "uncheckCheckboxesAtIndexes",
  (indexes, elementSelector) => {
    const indexArr = indexes.split(",").map(Number);

    indexArr.forEach((index) => {
      cy.get(selectors[elementSelector])
        .eq(index)
        .scrollIntoView()
        .uncheck({ force: true });
    });
  }
);
