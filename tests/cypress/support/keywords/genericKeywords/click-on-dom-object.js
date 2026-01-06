import * as selectors from '../../step_definitions/mappings-importer';

Cypress.Commands.add('customClick', (elementSelector, options = {}) => {
  cy.get('body').then((body) => {
    if (body.find(selectors[elementSelector]).length > 0) {
      cy.get(selectors[elementSelector])
        .filter(':visible')
        .click(options);
    } else {
      cy.contains(elementSelector)
        .filter(':visible')
        .click(options);
    }
  });
});

Cypress.Commands.add('dropdownCustomClick', (elementSelector, options = {}) => {
  cy.get('body').then((body) => {
    if (body.find(selectors[elementSelector]).length > 0) {
      cy.get(selectors[elementSelector])
        .click(options);
    } else {
      cy.contains(elementSelector)
        .click(options);
    }
  });
});

Cypress.Commands.add('clickLinkToSameWindow', (elementSelector, detached = false) => {
  const linkSelector = cy.get(selectors[elementSelector]);
  if (detached) {
    linkSelector.invoke('attr', 'target', '_self').click({ force: true });
  } else {
    linkSelector.invoke('attr', 'target', '_self').click();
  }
});

Cypress.Commands.add('clickLinkToSameWindowWithDynamicHref', (elementSelector, href, detached = false) => {
  const linkSelector = cy.get(`${selectors[elementSelector]} [href*=${href}]`);
  if (detached) {
    linkSelector.invoke('attr', 'target', '_self').click({ force: true });
  } else {
    linkSelector.invoke('attr', 'target', '_self').click();
  }
});

Cypress.Commands.add('clickLinkTextToSameWindow', (elementText) => {
  cy.contains(elementText)
    .invoke('removeAttr', 'target')
    .click({ force: true });
});

Cypress.Commands.add('clickIndexElement', (number, elementSelector) => {
  cy.get(selectors[elementSelector])
    .eq(number)
    .scrollIntoView()
    .click({ force: true });
});

Cypress.Commands.add('clickValueInField', (value, elementSelector, link = false) => {
  if (link) {
    cy.get(selectors[elementSelector]).contains(value).click({ force: true });
  } else {
    cy.wait(1000);
    cy.get(selectors[elementSelector])
      .contains(value)
      .scrollIntoView()
      .click({ force: true });
  }
});

Cypress.Commands.add('checkButtonNotClickable', (elementSelector) => {
  cy.get(selectors[elementSelector]).should('not.be.enabled');
});

Cypress.Commands.add('checkFieldNotClickable', (elementSelector) => {
  cy.get(selectors[elementSelector]).should('not.be.enabled');
});

Cypress.Commands.add('checkButtonIsClickable', (elementSelector) => {
  cy.get(selectors[elementSelector]).should('be.enabled');
});

Cypress.Commands.add('clickAndSelect', (quicklinks, bookJob) => {
  cy.get(selectors[quicklinks]).click();
  cy.get(selectors[bookJob]).click();
});