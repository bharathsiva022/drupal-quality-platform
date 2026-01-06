import * as selectors from '../../step_definitions/mappings-importer';

Cypress.Commands.add('checkFieldContains', (elementSelector, assertionValue) => {
  const array = assertionValue.split(',');
  array.forEach((item) => {
    cy.contains(item);
    cy.get('body').then((body) => {
      if (body.find(selectors[elementSelector]).length > 0) {
        cy.get(selectors[elementSelector]).should('contain', item);
      } else {
        cy.get(selectors[elementSelector])
          .scrollIntoView()
          .should('contain', item);
      }
    });
  });
});

Cypress.Commands.add('checkFieldDoesNotContain', (elementSelector, assertionValue) => {
  cy.get('body').then((body) => {
    if (body.find(selectors[elementSelector]).length > 0) {
      const array = assertionValue.split(',');
      array.forEach((item) => {
        cy.get(selectors[elementSelector]).should('not.contain', item);
      });
    }
  });
});

Cypress.Commands.add('checkInputFieldContains', (elementSelector, assertionValue) => {
  cy.get('body').then((body) => {
    if (body.find(selectors[elementSelector]).length > 0) {
      cy.get(selectors[elementSelector])
        .invoke('val')
        .should('contain', assertionValue);
    } else {
      cy.get(selectors[elementSelector])
        .scrollIntoView()
        .invoke('val')
        .should('contain', assertionValue);
    }
  });
});

Cypress.Commands.add('checkPageContainsValue', (assertionValue) => {
  const array = assertionValue.split(',');
  array.forEach((item) => {
    cy.contains(item);
    cy.get('.messages__content').invoke('text').should('contain', item);
  });
});

Cypress.Commands.add('checkPageSuccessContainsValue', (assertionValue) => {
  cy.get('.messages__content, .alert > p')
    .first()
    .invoke('text')
    .then((text) => {
      const normalizedText = text
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
      expect(normalizedText).to.contain(assertionValue.toLowerCase());
    });
});

Cypress.Commands.add('checkPageDoesNotContainValue', (assertionValue) => {
  const array = assertionValue.split(',');
  array.forEach((item) => {
    cy.get('body').then((el) => {
      expect(el).not.to.contain(item);
    });
  });
});

Cypress.Commands.add('checkPageContainsValues', (dataTable) => {
  dataTable.hashes().forEach((elem) => {
    cy.get(selectors[elem.Element])
      .should('be.visible')
      .and('contain', elem.Value);
  });
});

Cypress.Commands.add('checkFieldContainsAttributeWithValue', (field, attribute, attributeValue) => {
  cy.get(selectors[field]).should('have.attr', attribute, attributeValue);
});

Cypress.Commands.add('checkFieldHasValue', (elementSelector, Value) => {
  cy.get(selectors[elementSelector])
    .should('have.value', Value);
});

Cypress.Commands.add('checkFieldContainsValues', (elementSelector, dataTable) => {
  dataTable.rawTable.forEach((row) => {
    const item = row[0].toString(); // Ensure it's a string

    cy.contains(item);

    cy.get('body').then((body) => {
      const selector = selectors[elementSelector];

      if (body.find(selector).length > 0) {
        cy.get(selector).should('contain', item);
      } else {
        cy.get(selector)
          .scrollIntoView()
          .should('contain', item);
      }
    });
  });
});
