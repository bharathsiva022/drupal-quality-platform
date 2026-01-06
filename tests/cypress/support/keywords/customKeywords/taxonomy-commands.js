import * as selectors from "../../step_definitions/mappings-importer";

Cypress.Commands.add('createTaxonomyTerm', (vocabulary, termName, description) => {
  cy.get(selectors.taxonomyTable).contains(vocabulary).closest('tr').within(() => {
    cy.get('a').contains('List terms').click();
  });
  cy.get(selectors.addTermButton).click();
  cy.get(selectors.termNameInput).type(termName);
  cy.get(selectors.CKeditor_source_editing_button).click();
  cy.get(selectors.CKeditor_textarea).type(description, { force: true });
  cy.get(selectors.saveAndGoToList).click();
});

// Command to edit a taxonomy term
Cypress.Commands.add('editTaxonomyTerm', (oldTermName, newTermName, vocabulary = null) => {
  if (vocabulary) {
    cy.get(selectors.taxonomyTable).contains(vocabulary).closest('tr').within(() => {
      cy.get('a').contains('List terms').click();
    });
  }
  cy.get(selectors.taxonomyTable).contains(oldTermName).closest('tr').within(() => {
    cy.get(selectors.editTermButton).first().click(); // Click the first "Edit" button within the row
  });
  cy.get(selectors.termNameInput).clear().type(newTermName);
  cy.get(selectors.saveButton).click();
});

// Command to delete a taxonomy term
Cypress.Commands.add('deleteTaxonomyTerm', (termName) => {
  cy.get(selectors.taxonomyTable).contains(termName).closest('tr').within(() => {
    cy.get(selectors.content_edit_toggle_button).click({ force: true });
    cy.get(selectors.deleteTermButton).click({ force: true });
  });
  cy.get(selectors.confirmation_button).click({ force: true });
});
