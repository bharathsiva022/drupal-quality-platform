import * as selectors from "../../step_definitions/mappings-importer"
import 'cypress-real-events/support'

Cypress.Commands.add('addParagraphType', (paragraphDetails) => {
    const labelName = `${paragraphDetails.label}`
    Cypress.env('labelName', labelName);
    cy.get(selectors.paragraph_add_paragraph_type).click();
    cy.enterValueInField(labelName, 'paragraph_edit_label')
    cy.enterValueInField(paragraphDetails.description, 'paragraph_edit_description')
    cy.get(selectors.paragraph_save_and_manage_fields).click();
});

Cypress.Commands.add('addFieldToParagraphType', (fieldDetails) => {
    cy.get(selectors.paragraph_create_new_field_button).click();
    cy.get(selectors.paragraph_field_select_field).contains(fieldDetails.field_type).click()
    cy.get('body').contains('Continue').click();
    cy.get(selectors.paragraph_edit_label).type(fieldDetails.label);
    cy.contains(fieldDetails.checkbox_option)
        .parent()
        .find('input[data-once="field-click-to-select"]')
        .check();
    cy.get('body').contains('Continue').click();
});
Cypress.Commands.add('configureAllowedValues', (values) => {
    cy.intercept('**').as('allRequests');
    values.forEach((row, index) => {
        if (index > 0) {
            cy.contains('Add another item').click();
            cy.wait('@allRequests'); // Add a small wait to ensure the new field appears
        }
        cy.get(`input[data-drupal-selector='edit-field-storage-subform-settings-allowed-values-table-${index}-item-label']`)
            .type(row.value)
            .should('have.value', row.value); // Verify the value is correctly typed
    });
});

Cypress.Commands.add('deleteParagraphType', (contentTypeLabel) => {
    cy.contains(selectors.basic_table_locator, contentTypeLabel).within(() => {
        // Open the operations dropdown
        cy.get(selectors.content_edit_toggle_button).click();
        // Click on the "Delete" button in the dropdown menu
        cy.contains('Delete').click();
    });
    const exists = cy.get('[id="drupal-modal"]')
    if (exists) {
        cy.get('[id*="edit-delete-entities"]').click()
        cy.get(selectors.content_delete_dialog_delete_button).should('be.visible').click();
    } else if (!exists) {
        cy.get(selectors.content_delete_dialog_delete_button).should('be.visible').click();
    }

});




