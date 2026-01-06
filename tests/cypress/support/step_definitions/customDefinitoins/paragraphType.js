import * as selectors from "../../step_definitions/mappings-importer"
const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');

When('I add a new paragraph type with the following details:', (dataTable) => {
    const paragraphDetails = dataTable.hashes()[0];
    cy.addParagraphType(paragraphDetails);
});


When('I add a new field with the following details:', (dataTable) => {
    const fieldDetails = dataTable.hashes()[0];
    cy.addFieldToParagraphType(fieldDetails);
});

When('I configure allowed values for the field with:', (dataTable) => {
    const values = dataTable.hashes();
    cy.configureAllowedValues(values);
    cy.customClick('Save settings')
});

When('I add a new content type with the following details:', (dataTable)=>{
    cy.get(selectors.basic_create_button).click();
    cy.fillForm(dataTable);
})

When('I delete the list content {string}', (title) => {
    cy.deleteContent(title);  // Custom command for content deletion
});

When('I delete the paragraph type {string}', (paragraphType)=>{
    cy.deleteParagraphType(paragraphType)
})

When('I delete the content type {string}', (paragraphType)=>{
    cy.deleteContentType(paragraphType)
})
