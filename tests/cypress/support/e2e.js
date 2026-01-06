import './commands';
import '@percy/cypress';
import 'cypress-axe';


import 'cypress-plugin-api';
import 'cypress-real-events';
import '@mmisty/cypress-allure-adapter/support';
import { getDate } from './methods/getDate.js';

//Import custom keyword library
import './keywords/customKeywords/drupal-commands.js'
import './keywords/customKeywords/drupal-layout-builder.js'
import './keywords/customKeywords/taxonomy-commands.js'
import './keywords/customKeywords/media-commands.js'
import './keywords/customKeywords/user-roles-permissions.js'
import './keywords/customKeywords/paragraph-types.js'
import './keywords/customKeywords/menu-commands.js'
import './keywords/customKeywords/content-types.js'
import './keywords/customKeywords/ckeditor-commands.js'

//import generic keyword library
import './keywords/genericKeywords/check-uncheck-the-checkbox'
import './keywords/genericKeywords/clear-the-value-of-field'
import './keywords/genericKeywords/click-on-dom-object'
import './keywords/genericKeywords/contain-or-does-not-contain-css'
import './keywords/genericKeywords/contains-or-does-not-contain-class'
import './keywords/genericKeywords/contains-or-does-not-contain-value'
import './keywords/genericKeywords/enable-disabled-dom-object'
import './keywords/genericKeywords/enter-value-in-a-field'
import './keywords/genericKeywords/field-validation-error-message'
import './keywords/genericKeywords/field-visible-not-visible'
import './keywords/genericKeywords/mouse-real-events'
import './keywords/genericKeywords/navigate-back-&-forward'
import './keywords/genericKeywords/navigate-to-url'
import './keywords/genericKeywords/select-on-dom-object'
import './keywords/genericKeywords/set-cookie'
import './keywords/genericKeywords/to-use-slider'
import './keywords/genericKeywords/url-contains-not-contains'
import './keywords/genericKeywords/verify-cookie'
import './keywords/genericKeywords/verify-count-in-a-field'
import './keywords/genericKeywords/verify-titles'
import './keywords/genericKeywords/wait'
import './keywords/genericKeywords/applitools-eyes-commands.js'
import './keywords/genericKeywords/reusable-commands.js'
import './keywords/genericKeywords/accept-cookies.js'

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test 
  return false;
});

Cypress.on('window:before:load', (win) => {
  cy.stub(win.console, 'error').as('consoleError');
});

const config = Cypress.config();

// The name of the cookie holding whether the user has accepted
const COOKIE_NAME = "OptanonAlertBoxClosed";
// The value meaning that user has accepted the cookie policy
const COOKIE_VALUE = getDate;

Cypress.on("window:before:load", window => {
  window.document.cookie = `${COOKIE_NAME}=${COOKIE_VALUE}`;
});

// allure report configuration
const browser = Cypress.browser;
const cypressVersion = Cypress.version;
const browserVersion = browser.version;
const browserName = browser.displayName;
const url = Cypress.config().baseUrl;
const parsedUrl = new URL(url);
const domain = parsedUrl.hostname;

Cypress.Allure.writeEnvironmentInfo({
  'Application': 'INX International',
  'Environment': domain,
  Browser: browserName,
  'Browser Version': browserVersion,
  'Cypress Version': cypressVersion,
});