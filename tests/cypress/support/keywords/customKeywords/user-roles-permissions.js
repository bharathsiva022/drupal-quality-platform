import * as selectors from "../../step_definitions/mappings-importer";

Cypress.Commands.add('getPermissionsForRole', (roleName) => {
  cy.visit('/admin/people/permissions'); // Navigate to permissions page

  // Find the role column in the table and gather all permissions checked for that role
  cy.get('table#permissions tbody tr').then($rows => {
    const permissions = [];

    $rows.each((index, row) => {
      const $row = Cypress.$(row);
      const roleCheckbox = $row.find(`input[name*="${roleName}"]`);

      if (roleCheckbox.is(':checked')) {
        const permissionName = $row.find('td.views-field-permission').text().trim();
        permissions.push(permissionName);
      }
    });

    cy.wrap(permissions).as('rolePermissions'); // Store the permissions as an alias
  });
});

Cypress.Commands.add('visitAndValidateAccess', (pageUrl, expectedResult) => {
  cy.visit(pageUrl, { failOnStatusCode: false }); // Prevent Cypress from failing on 403

  // If the user is not authorized, check for the 403 error message
  if (expectedResult === 'You are not authorized to access this page.') {
    cy.contains(expectedResult).should('be.visible');
  } else {
    // Otherwise, ensure they can access the page and see the expected content
    cy.contains(expectedResult).should('be.visible'); // e.g., "Create new content"
  }
});