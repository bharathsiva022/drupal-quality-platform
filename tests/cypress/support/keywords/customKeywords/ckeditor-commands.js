import * as selectors from "../../step_definitions/mappings-importer";
import "cypress-real-events/support";

Cypress.Commands.add("typeInCkEditor", (text) => {
  cy.get(selectors.CKeditor_source_editing_button).then(($button) => {
    if (!$button.hasClass("ck_on")) {
      cy.wrap($button).click();
    }
  });
  cy.get(selectors.CKeditor_textarea).clear().type(text, { force: true });
  cy.get(selectors.CKeditor_source_editing_button).then(($button) => {
    if ($button.hasClass("ck_on")) {
      cy.wrap($button).click();
    }
  });
});

Cypress.Commands.add("fillInCKEditor", (locator, value) => {
  cy.get(`[id="${locator}"]`).then(($el) => {
    const fieldId = $el.attr("id");
    if (!fieldId) {
      throw new Error(
        `Could not find an ID for the field with locator: ${locator}`
      );
    }
    cy.window().then((win) => {
      const ckeditorInstance = win.CKEDITOR.instances[fieldId];
      if (!ckeditorInstance) {
        throw new Error(`CKEditor instance not found for field: ${locator}`);
      }
      ckeditorInstance.setData(value);
    });
  });
});

Cypress.Commands.add("setCKEditorContent", (selector, content) => {
  cy.window().then((win) => {
    const editorElement = win.document.querySelector(selector);

    if (!editorElement) {
      throw new Error(`Editor element not found for selector: ${selector}`);
    }
    const editorInstance = editorElement.ckeditorInstance;
    if (editorInstance) {
      editorInstance.setData(content);
    } else {
      throw new Error("CKEditor instance not found on the editor element");
    }
  });
});

Cypress.Commands.add("setCKEditorContentSections", (sectionSelector, content) => {
  cy.get(sectionSelector)
    .find(".ck-editor__editable_inline") // Find CKEditor5 content area
    .should("exist")
    .then(($el) => {
      const editorElement = $el[0]; // Get the raw DOM element
      cy.window().then((win) => {
        if (!win.document.querySelector(sectionSelector)) {
          throw new Error(`Editor element not found for selector: ${sectionSelector}`);
        }
        const editorInstance = editorElement.ckeditorInstance
        if (!editorInstance) {
          throw new Error(`CKEditor instance not found for section: ${sectionSelector}`);
        }
        editorInstance.setData(content);
      });
    });
});

Cypress.Commands.add(
  "formatTextInCkEditor",
  (formatType, inputValue, fixtureFile = null) => {
    if (fixtureFile) {
      cy.fixture(fixtureFile).then((fileContent) => {
        inputValue = fileContent;
        formatText(formatType, inputValue);
      });
    } else {
      formatText(formatType, inputValue);
    }
    function formatText(formatType, inputValue) {
      let formattedContent;

      if (formatType === "bold") {
        cy.get(selectors.ckeditor_toolbar_item_bold_button).click({ force: true });
        formattedContent = `<strong>${inputValue}</strong>`;
      } else if (formatType === "italic") {
        cy.get(selectors.ckeditor_toolbar_item_italic_button).click({ force: true });
        formattedContent = `<em>${inputValue}</em>`;
      } else if (formatType === "link") {
        cy.get(selectors.ckeditor_toolbar_item_link_button).click({ force: true });
        formattedContent = `<a href="${inputValue}">${inputValue}</a>`;
      } else if (formatType === "bulleted") {
        cy.get(selectors.ckeditor_toolbar_item_bulleted_list_button).click({
          force: true,
        });
        formattedContent = `
          ${inputValue}`;
      } else if (formatType === "numbered") {
        cy.get(selectors.ckeditor_toolbar_item_numbered_list_button).click({
          force: true,
        });
        formattedContent = `
          ${inputValue}`;
      } else if (formatType === "blockquote") {
        cy.get(selectors.ckeditor_toolbar_item_block_quote_button).click({
          force: true,
        });
        formattedContent = `
          ${inputValue}`;
      } else if (formatType === "image") {
  cy.get(selectors.ckeditor_toolbar_item_image_button).click({ force: true });
  formattedContent = `<img src=${inputValue}>`;
  cy.contains('button.ck-button-action', 'Accept', { timeout: 10000 })
    .should('be.visible')
    .click({ force: true });
} 

      cy.setCKEditorContent(selectors.ckeditor_role_textbox, formattedContent);
    }
  }
);

Cypress.Commands.add("selectMediaFile", (mediaFileName) => {
  cy.get(selectors.ckeditor_toolbar_item_insert_media_button).should('be.visible').click({ force: true });
  cy.wait(3000)
  cy.get(selectors.ckeditor_toolbar_item_insert_media_list).then(($elements) => {
  const $target = $elements.filter((i, el) => {
    return Cypress.$(el).text().trim() === mediaFileName;
  });

  if ($target.length) {
    cy.wrap($target).click({ force: true });
  }
});

cy.contains('button.media-library-select', 'Insert selected', { timeout: 10000 })
  .should('be.visible')
  .click({ force: true });
});


Cypress.Commands.add("saveContent", () => {
  cy.get(selectors.content_save_button).click();
});

Cypress.Commands.add("validateContentInFrontend", (expectedContent) => {
  cy.contains(expectedContent).should("exist");
});

Cypress.Commands.add("insertTableInCKEditor", (rows, columns) => {
  cy.setCKEditorContent(selectors.ckeditor_role_textbox, "");
  cy.get(selectors.ckeditor_toolbar_item_insert_table_button).click({ force: true });

  const gridCellSelector = `.ck-insert-table-dropdown-grid-box[data-row="${rows}"][data-column="${columns}"]`;

  cy.get(gridCellSelector).click({ force: true });

  cy.get(".ck-editor__editable table").within(() => {
    cy.get("tr").should("have.length", rows); // Assert the number of rows
    cy.get("tr:first-child td").should("have.length", columns); // Assert the number of columns
  });
});

Cypress.Commands.add("setTableInCKEditor", (selector, data) => {
  // Construct the HTML for the table
  let tableHTML = "<table>";
  data.forEach((row) => {
    tableHTML += "<tr>";
    row.forEach((cell) => {
      tableHTML += `<td>${cell}</td>`;
    });
    tableHTML += "</tr>";
  });
  tableHTML += "</table>";

  cy.setCKEditorContent(selector, tableHTML);
});

Cypress.Commands.add("validateTableData", (data) => {
  cy.get(".node__content table").within(() => {
    data.forEach((row, rowIndex) => {
      row.forEach((cellData, colIndex) => {
        cy.get(
          `tr:nth-child(${rowIndex + 1}) td:nth-child(${colIndex + 1})`
        ).should("contain.text", cellData);
      });
    });
  });
});

Cypress.Commands.add(
  "setCKEditorContentWithHorizontalLine",
  (selector, content) => {
    const formattedContent = `${content}<hr>`;
    cy.setCKEditorContent(selector, formattedContent);
  }
);
