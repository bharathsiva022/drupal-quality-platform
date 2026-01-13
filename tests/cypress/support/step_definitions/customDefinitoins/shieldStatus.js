const {
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");


let siteConfig;
let authResponse;


Given('I load the site configuration from {string}', (fileName) => {
  cy.readFile(`config/${fileName}`).then((config) => {
    siteConfig = config;
  });
});
When('I check authentication protection for the configured site', () => {
  cy.request({
    url: siteConfig.baseUrl,
    failOnStatusCode: false,
  }).then((response) => {
    authResponse = response;
  });
});

Then('the shield {string} be enabled', (status) => {
  const hasShield =
    authResponse.status === 401 &&
    authResponse.headers['www-authenticate']?.includes('Basic');

  if (status === 'should') {
    expect(hasShield, 'Shield should be enabled').to.be.true;
  } else {
    expect(hasShield, 'Shield should NOT be enabled').to.be.false;
  }
});
