const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');
import * as selectors from "../mappings-importer";

Given('I login as {string} with username {string} and password {string}', (role, username, password) => {
    cy.loginAs(username, password, role);
});

When('I attempt to {string}', (action) => {
    if (action === 'create content') {
        cy.visit('/node/add', { failOnStatusCode: false });
    } else if (action === 'Add media') {
        cy.visit('/admin/content/media', { failOnStatusCode: false });
    } else if (action === 'Add content block') {
        cy.visit('/admin/content/media', { failOnStatusCode: false });
    } else if (action === 'Add user') {
        cy.visit('/admin/people', { failOnStatusCode: false });
    } else if (action === 'Admin Toolbar') {
        cy.visit('/admin/people', { failOnStatusCode: false });
    }
});

Then('I validate the visibility of the following elements:', (dataTable) => {
    dataTable.hashes().forEach((row) => {
        const element = row.element;
        const visibilityState = row.result;
        const locator = row.locator

        cy.log(`Validating visibility of: ${element} with expected state: ${visibilityState} for locator: ${locator}`);


        // Conditionally check the visibility or non-visibility of elements
        if (visibilityState === 'visible') {
            cy.get(selectors[locator]).should('exist'); // Element should be visible
            cy.log(`User allowed to perform the ation: ${element}`)
        } else if (visibilityState === 'not visible') {
            cy.get(selectors[locator]).should('not.exist'); // Element should not be visible
            cy.log(`User not allowed to perform the ation : ${element} `)
        }
    });
});

