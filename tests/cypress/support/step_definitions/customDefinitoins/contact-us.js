const {
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");
import * as selectors from "../mappings-importer";

When('I fill in the contact form with the following details:', (dataTable) => {
  cy.fillForm(dataTable);
});
