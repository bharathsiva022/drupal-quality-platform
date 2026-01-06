import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";
import * as selectors from "../mappings-importer";

Given('I clicks on the {string} to navigate to login page', (locator) => {
  cy.customClick(locator);
})

Then('I should see the profile for {string} in the toolbar section', (user) => {
  cy.get(selectors.home_page_tool_bar).contains(Cypress.env(user));
})

Given('I login to admin dashboard with username {string} and password {string}', (username, password) => {
  cy.loginToDrupal(username, password)
  cy.acceptCookies()
})