import getCookie from "../../methods/getCookie";

Cypress.Commands.add("navigateToUrl", (input) => {
  if (input.startsWith('http') || input.startsWith('/')) {
    // Direct URL or relative path
    cy.visit(input);
    cy.document().should((doc) => {
  expect(doc.readyState).to.equal('complete');
});
  } else {
    // Treat as Cypress.env alias
    const savedUrl = Cypress.env(input);
    if (!savedUrl) {
      throw new Error(`No URL found in Cypress.env() for alias: ${input}`);
    }
    cy.visit(savedUrl);
  }
});