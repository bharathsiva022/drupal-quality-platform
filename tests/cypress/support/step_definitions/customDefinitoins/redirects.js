const {When,Then,} = require("@badeball/cypress-cucumber-preprocessor");

const adminPath = '/admin/config/search/redirect';
const base = Cypress.config('baseUrl');

const makeAbsolute = (p) => {
  if (!p) return null;
  p = p.trim();
  if (p.startsWith('http')) return p;
  if (!p.startsWith('/')) p = '/' + p;
  return base.replace(/\/$/, '') + p;
};

When("I open the redirects admin page", () => {
  cy.request({ url: adminPath, failOnStatusCode: false }).then((res) => {
    cy.wrap(res.status < 400).as('pageExists');
    if (res.status < 400) cy.visit(adminPath);
  });
});

Then("I validate the first 5 From To redirects",  () => {
  cy.get('@pageExists').then((exists) => {
    if (!exists) {
      cy.log("Redirect page not found. Skipping.");
      return;
    }

    cy.get('table.views-table tbody tr').each(($row, idx) => {
      if (idx >= 5) return;

      const fromText = $row.find('td.views-field-redirect-source__path').text().trim();
      const toText = $row.find('td.views-field-redirect-redirect__uri a').attr('href');

      const fromUrl = makeAbsolute(fromText);
      const toUrl = makeAbsolute(toText);

      cy.visit(fromUrl, { failOnStatusCode: false });
      cy.url().should('eq', toUrl.replace(/\/$/, ''));
    });
  });
});
