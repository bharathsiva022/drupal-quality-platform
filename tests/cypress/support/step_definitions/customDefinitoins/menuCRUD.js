const { Given, When, Then } = require('@badeball/cypress-cucumber-preprocessor');
import * as selectors from "../mappings-importer";

Given('I create a menu with name {string} and admin summary {string}', (menuName, adminSummary) => {
    cy.addMenu(menuName, adminSummary);
})

Given('I enter {string} as the menu name', (menuName) => {
    cy.enterValueInField(menuName, 'menu_title')
})

Given('I enter {string} as administrative summary', (adminSummary) => {
    cy.enterValueInField(adminSummary, 'menu_admin_summary')
})

Then('the menu {string} should be visible in the {string}', (menuName, tableLocator) => {
    cy.tableContains(tableLocator, menuName)
})

When('I click on {string} next to the menu {string}', (buttonText, menuTitle) => {
    cy.clickToEditMenu(buttonText, menuTitle)
})

When('I change the menu name to {string}', (updateName) => {
    cy.enterValueInField(updateName, 'menu_title')
})

Then('I delete the menu item {string}', (menuTitle) => {
    cy.deleteMenu(menuTitle);
})

Then('the menu {string} should not be visible in the {string}', (menuTitle, menuTable) => {
    cy.tableNotContains(menuTable, menuTitle)
})

When('I navigate to {string} menu links', (menuTitle) => {
    cy.clickToEditMenu(menuTitle);
})

When('I enter {string} as the link title', (linkTitle) => {
    cy.enterValueInField(linkTitle, 'menu_link_title')
})

When('I enter {string} as the link path', (linkPath) => {
    cy.enterValueInField(linkPath, 'menu_link_path')
})

When('I select {string} as the parent link', (parentLink) => {
    cy.selectFromDropdown(parentLink, "menu_parent_link_dropdown")
})

Then('the link {string} should be visible for the menu {string}', (linkTitle) => {
    cy.tableContains('menu_list', linkTitle)
})

When('I edit menu link {string} title to {string} and link path to {string}', (linkTitle, linkTitleUpdated, linkPathUpdated) => {
    cy.editContentWithTitle(linkTitle)
    cy.enterValueInField(linkTitleUpdated, 'menu_link_title')
    cy.enterValueInField(linkPathUpdated, 'menu_link_path')
    cy.customClick('basic_action_save')
})

Then('I delete the menu link {string}', (menuLink)=>{
    cy.deleteContentWithTitle(menuLink)
})