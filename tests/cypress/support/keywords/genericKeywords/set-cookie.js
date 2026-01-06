import * as selectors from '../../step_definitions/mappings-importer';
import {
  getTextAfter,
  getTextInBetweenFromUrl,
} from '../../methods/getTextFromURL';

Cypress.Commands.add('setCookieWithValue', (name, value) => {
  cy.setCookie(name, Cypress.env(value) || value);
});
