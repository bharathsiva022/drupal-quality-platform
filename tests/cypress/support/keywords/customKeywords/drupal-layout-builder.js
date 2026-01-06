import * as selectors from "../../step_definitions/mappings-importer"
import 'cypress-real-events/support'

Cypress.Commands.add('addSection', (sectionIndex = 1, sectionType, settings = {}) => {
  const section = `[data-layout-builder-highlight-id="section-${sectionIndex}"]  > a`
  cy.log(section)
  cy.get(`[data-layout-builder-highlight-id="section-${sectionIndex}"]  > a`).click();
  cy.get(selectors.layout_choose_layout_option).contains(sectionType).click()
  if (settings) {
    cy.fillForm(settings)
  }
  cy.get(selectors.content_edit_actions).contains('Save').click();
})
Cypress.Commands.add('addBlock', (blockType, sectionIndex, blockSettings = {}) => {
  // Find the specific section where the block will be added
  cy.get(`[data-layout-builder-highlight-id='block-${sectionIndex}-content']`).click();
  cy.get("[class='layout-builder-browser-block-item']").contains(blockType).click();  // Select the block type
  if (blockSettings) {
    cy.fillForm(blockSettings)
  }
});