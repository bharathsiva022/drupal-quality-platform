import * as selectors from "../../step_definitions/mappings-importer"

Cypress.Commands.add('createContent', (contentType, dataTable,type) => {
    contentType = (contentType === 'Basic') ? 'landing' : contentType;

    cy.get(selectors.content_add_content_button).click({ force: true });
    // cy.contains(`'a.admin-item__link', ${contentType}`).click({ force: true });
    cy.contains('a.admin-item__link', contentType).click({ force: true });
    if (type) {
        
    }
    
    // cy.contains('summary', 'Description and Background').click({ force: true });


    cy.fillForm(dataTable);
});

Cypress.Commands.add('editContent', (dataTable) => {
    cy.get(selectors.primary_action_tab).contains('Edit').click({ force: true });
    cy.fillForm(dataTable);
});

Cypress.Commands.add('clickOnEditContent', (contentTitle) => {
    cy.filterTitle(contentTitle);
    cy.get(selectors.basic_table_locator).then(($rows) => {
        const matchingRow = $rows.filter((index, row) => {
            return Cypress.$(row).text().includes(contentTitle);
        }).first();
        cy.wrap(matchingRow).find(selectors.content_edit_button).click({ force: true });
    })
})

Cypress.Commands.add('clickToViewContent', (contentTitle) => {
    cy.filterTitle(contentTitle);
    cy.get(selectors.basic_table_locator).then(($rows) => {
        const matchingRow = $rows.filter((index, row) => {
            return Cypress.$(row).text().includes(contentTitle);
        }).first();
        cy.wrap(matchingRow).find(selectors.content_table_item).should('be.visible').click({ force: true });
    })
})

Cypress.Commands.add('deleteContentType', (contentTypeLabel) => {
    cy.contains(selectors.basic_table_locator, contentTypeLabel).within(() => {
        // Open the operations dropdown
        cy.get(selectors.content_edit_toggle_button).click();
        // Click on the "Delete" button in the dropdown menu
        cy.contains('Delete').click();
    });

    // Confirm the deletion in the confirmation dialog
    cy.get(selectors.content_delete_dialog_delete_button).should('be.visible').click();
});

Cypress.Commands.add('selectContentType', (contentType) => {
    cy.get(selectors.content_type_selector).contains(contentType).click({ force: true });
});

Cypress.Commands.add("manageMultiValueField", (fieldLabel, action, values = []) => {
    cy.get('#field-credit-type-values') // Locate the field section by label
        .within(() => {
            cy.get('#edit-field-credit-type-0-target-id').should("have.length.at.least", 1); // Ensure at least one field is present

            if (action === "add") {
                values.forEach((value, index) => {
                    if (index > 0) {
                        cy.get("[id*='add more']").click(); // Click "Add another item" button to add a new field
                    }
                    cy.get(`#edit-field-credit-type-${index}-target-id`).eq(index).type(value);
                });
            }

            if (action === "validate") {
                values.forEach((value) => {
                    cy.contains(value).should("be.visible"); // Ensure value is displayed
                });
            }

            if (action === "remove") {
                cy.get('button:contains("Remove")').first().click(); // Click "Remove" button for the first entry
                cy.wait(500); // Wait to ensure UI updates
            }
        });
});

