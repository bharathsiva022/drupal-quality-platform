import * as selectors from "../../step_definitions/mappings-importer";
const implementation = (elementKey, condition) => {
  const element = selectors[elementKey];
  cy.get(element).should(condition);
};

Cypress.Commands.add("checkField", (elementKey, condition) => {
  const element = selectors[elementKey];
  cy.get(element).should(condition);
});

Cypress.Commands.add("checkElementVisibility", (elementKey, visibilityType) => {
  const visibilityConditions = {
    visible: "be.visible",
    notVisible: "be.hidden",
    notExist: "not.exist",
  };
  const condition = visibilityConditions[visibilityType];
  if (condition) {
    cy.checkField(elementKey, condition);
  } else {
    throw new Error("Invalid visibility type provided");
  }
});

Cypress.Commands.add('elementIsVisible', (elementKey) => {
  cy.get(selectors[elementKey]).should('be.visible');
});

Cypress.Commands.add('elementIsVisibleUpOnScrolling', (elementKey) => {
  cy.get(selectors[elementKey]).scrollIntoView().should('be.visible');
});

Cypress.Commands.add('elementIsNotVisible', (elementKey) => {
  cy.get(selectors[elementKey]).should('be.hidden');
});

Cypress.Commands.add('elementNotExist', (elementKey) => {
  cy.get(selectors[elementKey]).should('not.exist');
});

Cypress.Commands.add('elementIsExist', (elementKey) => {
  cy.get(selectors[elementKey]).should('exist');
})

Cypress.Commands.add("checkElementInViewport", (element) => {
  cy.get(selectors[element]).should(($el) => {
    const bottom = Cypress.$(cy.state("window")).height();
    const rect = $el[0].getBoundingClientRect();

    expect(rect.top).not.to.be.greaterThan(bottom);
    expect(rect.bottom).not.to.be.greaterThan(bottom);
    expect(rect.top).not.to.be.greaterThan(bottom);
    expect(rect.bottom).not.to.be.greaterThan(bottom);
  });
});

Cypress.Commands.add("scrollToElement", (element) => {
  cy.get(selectors[element]).scrollIntoView();
});

Cypress.Commands.add("scrollToBottom", () => {
  cy.scrollTo("bottom");
});

Cypress.Commands.add("scrollToTop", () => {
  cy.scrollTo("top");
});

Cypress.Commands.add(
  "buttonChecked",
  (elementSelector) => {
    cy.get(selectors[elementSelector]).should("be.checked");
  }
);

Cypress.Commands.add(
  "buttonNotChecked",
  (elementSelector) => {
    cy.get(selectors[elementSelector]).should("not.be.checked");
  }
);

Cypress.Commands.add(  "fieldVisibleAndContains",
    (elementSelector, assertionValue) => {
      implementation(elementSelector, "be.visible");

      const field = cy.get(selectors[elementSelector]).scrollIntoView();

      field.should((element) => {
        expect(element).to.contain(assertionValue);
      });
    }
);