const {
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");
import '@cypress-audit/lighthouse/commands'

let pages = [];

Given("I load the test pages from fixture {string}", (fixtureFile) => {  
  cy.fixture(`visualRegression/${fixtureFile}`).then((data) => {
    if (!data || typeof data !== "object") {
      throw new Error(`Fixture '${fixtureFile}' must be an object`);
    }
    pages = Object.values(data);
  });
});

When("I run performance checks for {int} pages from {string} file", (pageCount, fixtureFile) => {
  cy.then(() => {
    if (pages.length === 0) {
      throw new Error(`No pages loaded from fixture '${fixtureFile}'`);
    }

    const pagesToTest = Math.min(pageCount, pages.length);
    const selectedPages = getRandomPages(pages, pagesToTest);

    const baseUrl = Cypress.config("baseUrl");
    const username = Cypress.env("username");
    const password = Cypress.env("password");

    cy.wrap(selectedPages).each((page) => {
      const url = `${baseUrl}${page.url}`;
      const pageKey = page.testName || page.url;

      // Handle authentication
      if (page.auth) {
        cy.loginForVisual(username, password);
      } else {
        cy.clearCookies();
        cy.clearLocalStorage();
      }

      cy.log(`Running Lighthouse performance audit for ${pageKey}`);
      cy.visit(url, { failOnStatusCode: false });

      // Wait until the page is fully loaded
      cy.window().should('have.property', 'document')
        .and('have.property', 'readyState')
        .and('eq', 'complete');
      cy.document().should('have.property', 'readyState', 'complete');
      cy.get('body').should('be.visible');

      // Run Lighthouse (Desktop)
      cy.log(`Running Lighthouse audit for Desktop form factor`);
      cy.viewport(1920, 1080);

      cy.lighthouse({
        performance: 0,
        accessibility: 0,
        "best-practices": 0,
        seo: 0,
      }, {
        output: ['json'],
        reportName: `${pageKey}-desktop-audit`,
        formFactor: 'desktop',
        screenEmulation: { mobile: false },
        throttlingMethod: 'simulate',
        widths: page.widths || [375, 768, 1440],
      });

      // Run Lighthouse (Mobile)
      cy.log(`Running Lighthouse audit for Mobile form factor`);
      cy.viewport(375, 667);

      cy.lighthouse({
        performance: 0,
        accessibility: 0,
        "best-practices": 0,
        seo: 0,
      }, {
        output: ['json'],
        reportName: `${pageKey}-mobile-audit`,
        formFactor: 'mobile',
        screenEmulation: { mobile: true },
        throttlingMethod: 'simulate',
        widths: page.widths || [375, 768, 1440],
      });
    });
  });
});

function getRandomPages(allPages, count) {
  if (count >= allPages.length) return [...allPages];
  const shuffled = [...allPages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}


Then("I generate a performance summary report", () => {
  return cy.exec('node cypress/support/methods/summarize-performance-testing.js', { failOnNonZeroExit: false })
  .then(({ stdout, stderr }) => {
      if (stderr) {
        cy.log('Error:', stderr);
        console.error(stderr);
      }
      cy.log(stdout);
      console.log(stdout);
    });
});
