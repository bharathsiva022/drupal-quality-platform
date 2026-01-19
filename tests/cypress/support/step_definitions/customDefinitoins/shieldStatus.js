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

Then("large images should be lazy loaded", () => {
  const viewportHeight = Cypress.config("viewportHeight");
  let hasAtLeastOneLazyElement = false;
  let offScreenCount = 0;

  cy.get("img:visible, iframe:visible").each(($el) => {
    const rect = $el[0].getBoundingClientRect();
    if (rect.top > (viewportHeight + 100)) {
      offScreenCount++;

      const loadingAttr = $el.attr("loading");
      const dataSrc = $el.attr("data-src") || $el.attr("data-lazy") || $el.attr("data-srcset");

      if (loadingAttr === "lazy" || !!dataSrc) {
        hasAtLeastOneLazyElement = true;
      }
    }
  }).then(() => {
    expect(offScreenCount, "No off-screen images found! Ensure the page has enough content to scroll.")
      .to.be.greaterThan(0);

    expect(hasAtLeastOneLazyElement, 
      `Lazy loading check failed: Out of ${offScreenCount} off-screen elements, none had 'loading="lazy"' or data-src attributes.`
    ).to.be.true;

    cy.log(`Lazy loading is active! Verified ${offScreenCount} off-screen elements.`);
  });
});