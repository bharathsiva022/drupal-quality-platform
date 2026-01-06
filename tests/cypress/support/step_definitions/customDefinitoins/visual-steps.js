import { Given, When } from "@badeball/cypress-cucumber-preprocessor";

let pages = [];

Given("I load pages from fixture {string}", (fixtureFile) => {
  cy.fixture(`visualRegression/${fixtureFile}`).then((data) => {
    if (!data || typeof data !== "object") {
      throw new Error(`Fixture '${fixtureFile}' must be an object`);
    }
    pages = Object.values(data);
  });
});

When("I capture Percy snapshots for each page", () => {
  cy.then(() => {
    if (!Array.isArray(pages) || pages.length === 0) {
      throw new Error("Pages not loaded correctly from fixture");
    }
  });

  const baseUrl = Cypress.config("baseUrl");
  const username = Cypress.env("username");
  const password = Cypress.env("password");

  cy.wrap(pages).each((page) => {
    const url = `${baseUrl}${page.url}`;
    const snapName = page.testName || page.url;

    if (page.auth) {
      // custom login helper you already have
      cy.loginForVisual(username, password)
    } else {
      cy.clearCookies();
      cy.clearLocalStorage();
    }

    cy.log(`Visiting ${url} → snapshot: ${snapName}`);
    cy.visit(url, { failOnStatusCode: false });

    cy.wait(500);
    cy.percySnapshot(snapName, {
      widths: page.widths > 0 ? page.widths : [357,768,1440],
      minHeight: 900,
      percyCSS: `
        #CybotCookiebotDialog { display: none !important; }
        #sliding-popup { display: none !important; }
      `,
    });
  });
});

