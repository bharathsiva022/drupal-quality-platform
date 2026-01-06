import { Given, When, And, Then } from "@badeball/cypress-cucumber-preprocessor";
import * as selectors from "../mappings-importer";

When('the user selects the {string} component from the available components list', (componentName) => {
    cy.get('.layout-builder__add-block').click(); // Click on "Add block" to open the block list
    cy.get(selectors.drupal_layoutbuilder_filter_input).type(componentName)
    cy.get(selectors.drupal_layoutbuilder_block_list).contains(componentName).click(); // Select the component
});

When('the user click on the {string} button to apply the component', (button)=>{
    cy.get(selectors[button]).click();
})

When('the user click on the {string} button to save the layout', (button) => {
    cy.get(selectors[button]).contains('Save layout').click(); // Click the Save button
});

Then('the user should see the Announcement Feed block {string} on the landing page', (locator) => {
    cy.get(selectors[locator]).should('be.visible'); // Verify the text appears on the landing page
});
