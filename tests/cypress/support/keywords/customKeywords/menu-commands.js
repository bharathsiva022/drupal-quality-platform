import * as selectors from "../../step_definitions/mappings-importer"
import 'cypress-real-events/support'

Cypress.Commands.add('addMenu', (menuName, adminSummary) => {
  cy.visit('/admin/structure/menu/add');
  cy.enterValueInField(menuName, 'menu_title')
  cy.enterValueInField(adminSummary, 'menu_admin_summary')
  cy.customClick('basic_action_save');
});

Cypress.Commands.add('deleteMenu', (title) => {
  cy.get('table tbody tr').then(($rows) => {
    const matchingRow = $rows.filter((index, row) => {
      return Cypress.$(row).text().includes(title);
    }).first();
    cy.wrap(matchingRow).find(selectors.content_edit_toggle_button).click({ force: true });
    cy.wrap(matchingRow).find('a[href*="delete"]').click({ force: true });
    cy.get(selectors.confirmation_button).click({ force: true })
  });
});

Cypress.Commands.add('clickToEditMenu', (buttonText, menuTitle) => {
  cy.get('table tbody tr').then(($rows) => {
    const matchingRow = $rows.filter((index, row) => {
      return Cypress.$(row).text().includes(menuTitle);
    }).first();
    cy.wrap(matchingRow).contains(buttonText).click({ force: true });
  })
})

Cypress.Commands.add('assignToMenu', (title, menu) => {
  cy.get(selectors.primary_action_tab).contains('Edit').click({ force: true });
  cy.get('[class*=layout-region-node-secondary]').then(($el) => {
    if (!$el.is(':visible')) {
      cy.get('href="#toggle-sidebar"').click();
    }
  })
  cy.get('summary[aria-controls="edit-menu"]').click()
  cy.get('[id="edit-menu-enabled"]').click();
  cy.get('input[name="menu[title]"]').clear().type(title);
  cy.get('#edit-menu-menu-parent').select(menu);
});