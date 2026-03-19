import getCookie from "../../methods/getCookie";

Cypress.Commands.add("navigateToUrl", (input, overrides = {}) => {
  const shieldUsername = Cypress.env('SHIELD_USERNAME');
  const shieldPassword = Cypress.env('SHIELD_PASSWORD');

  const hasShield = shieldUsername && shieldPassword;

  let url;

  if (input.startsWith('http') || input.startsWith('/')) {
    url = input;
  } else {
    url = Cypress.env(input);

    if (!url) {
      throw new Error(`No URL found in Cypress.env() for alias: ${input}`);
    }
  }

  const visitOptions = {
    failOnStatusCode: false,
    ...(hasShield && {
      auth: {
        username: shieldUsername,
        password: shieldPassword
      }
    }),
    ...overrides
  };

  cy.visit(url, visitOptions);

  cy.document().should((doc) => {
    expect(doc.readyState).to.equal('complete');
  });
});