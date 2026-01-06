import * as selectors from "../../step_definitions/mappings-importer";
import { convertDateToISOFormat } from "../../methods/getDate";
import { fieldToSectionMap } from "../../methods/fieldToSectionMap";


function openSectionIfNeeded(fieldName) {
  const sectionLabel = fieldToSectionMap[fieldName];
  if (sectionLabel) {
    cy.contains('summary', sectionLabel).then(($summary) => {
      if ($summary.attr('aria-expanded') === 'false') {
        cy.wrap($summary).click({ force: true });
      }
    });
  }
}


Cypress.Commands.add(
  "enterValueInField",
  (value, elementSelector, detached = false) => {
    const field = cy
      .get(selectors[elementSelector]).scrollIntoView()
      .should("be.visible")
      .wait(500);
    if (detached) {
      field.type(Cypress.env(value) || value, { force: true });
    } else {
      field.clear({ force: true }).type(Cypress.env(value) || value, { force: true });
    }
  }
);

Cypress.Commands.add("fillForm", (dataTable) => {
  // cy.intercept("POST", "/api/*").as("allRequests");
  dataTable.hashes().forEach((elem) => {
     openSectionIfNeeded(elem.Field);

    if(elem.FieldType === "isMandatory") {
      cy.contains("button","Description and Background").click()
      cy.get(selectors[elem.Field]).should("have.attr", "aria-required", "true");

     }  else if (elem.FieldType === "ckSection") {
      if (elem.Value.startsWith("/")) {
        cy.fixture(elem.Value).then((fixtureContent) => {
          cy.setCKEditorContentSections(selectors[elem.Field], fixtureContent);
        });
      } else {
        cy.setCKEditorContentSections(selectors[elem.Field], elem.Value);
      }
    } 
   else if (elem.FieldType === "input") {
  if (elem.Value.trim().startsWith("/") && elem.Value.trim().endsWith(".html")) {
    const filePath = elem.Value.trim().replace(/^\/+/, ""); // Remove leading slashes
    cy.fixture(filePath).then((fixtureContent) => {
      cy.enterValueInField(fixtureContent, elem.Field);
    });
  } else {
    cy.enterValueInField(elem.Value, elem.Field);
  }
} else if (elem.FieldType === "date") {
      const inputDate = elem.Value;
      const isodate = convertDateToISOFormat(inputDate);
      cy.get(selectors[elem.Field]).clear().type(isodate);
    } //  else if (elem.FieldType === "ckeditor") {
    //   if (elem.Value.startsWith("/")) {
    //     cy.fixture(elem.Value).then((fixtureContent) => {
    //       cy.get(selectors.CKeditor_source_editing_button).click(); // Switch to source editing mode
    //       cy.get(selectors[elem.Field])
    //         .clear({ force: true })
    //         .type(fixtureContent, { parseSpecialCharSequences: false }); // Insert formatted content (HTML)
    //     });
    //   } 
    // }
    
    else if (elem.FieldType === "ckeditor") {
  if (elem.Value.startsWith("/")) {
    cy.fixture(elem.Value).then((fixtureContent) => {
      cy.get(selectors[elem.Field]).should('exist').should('be.visible')
        .then(($el) => {
          const editorElement = $el[0]; // Raw DOM element
          cy.window().then((win) => {
            const editorInstance = editorElement.ckeditorInstance;
            if (!editorInstance) {
              throw new Error(`CKEditor instance not found for: ${elem.Field}`);
            }
            editorInstance.setData(fixtureContent); // Set content using CKEditor's API
          });
        });}
    );
  } else {
        // If not using a fixture, input the provided value directly
        // cy.get(selectors.CKeditor_source_editing_button).click(); // Switch to source editing mode
        // cy.get(selectors[elem.Field])
        //   .clear({ force: true })
        //   .type(elem.Value, { parseSpecialCharSequences: false });

        cy.setCKEditorContent(selectors[elem.Field], elem.Value);
      }
    }    else if (elem.FieldType === "typeAndsearch") {
      cy.get(selectors[elem.Field]).focus().clear().type(elem.Value,{ timeout: 3000 });
      cy.get("[class='field-content media-library-item__content']").contains(elem.Value)
    .should("be.visible")
    .click({ force: true });
    cy.get('.ui-dialog-buttonset > .media-library-select').click({force: true})

    } 
    else if (elem.FieldType === "select") {
      cy.get(selectors[elem.Field]).select(elem.Value);
    } else if (elem.FieldType === "checkbox") {
      elem.Value
        ? cy
            .contains("label", elem.Value)
            .invoke("attr", "for")
            .then((id) => {
              cy.get(`#${id}`).check({ force: true });
            })
        : cy.get(selectors[elem.Field]).check().should("be.checked");
    } else if (elem.FieldType === "uncheck") {
      elem.Value
        ? cy
            .contains("label", elem.Value)
            .invoke("attr", "for")
            .then((id) => {
              cy.get(`#${id}`).uncheck({ force: true });
            })
        : cy.get(selectors[elem.Field]).uncheck().should("be.unchecked");
    } else if (elem.FieldType === "textbox") {
      cy.get(selectors[elem.Field])
        .find("[contenteditable]")
        .clear()
        .type(elem.Value);
    } else if (elem.FieldType === "textarea") {
      cy.get(selectors[elem.Field]).focus().clear().type(elem.Value);
    } else if (elem.FieldType === "button") {
      if (elem.Value) {
        cy.get(selectors[elem.Field])
          .contains(elem.Value)
          .scrollIntoView()
          .should("be.visible")
          .click({force: true});
      }else{
        cy.get(selectors[elem.Field]).scrollIntoView()
          .should("be.visible").wait(1000) 
          .click({force: true});
        }
      
    } else if (elem.FieldType === "file") {
      cy.get(selectors[elem.Field]).first().attachFile(elem.Value).wait(1000);
    } else if (elem.FieldType === "wait") {
      // Insert wait for the specified duration (in milliseconds)
      cy.wait(parseInt(elem.Value));
    } else if (elem.FieldType === "typeAndSelect") {
      // Type in the dropdown input
      cy.get(selectors[elem.Field])
        .clear()
        .type(elem.Value, { timeout: 5000 }) // Type the value
        // cy.wait
         //.should("have.value", elem.Value); // Ensure the value has been typed
     cy.get("body")
    .find("li, div") // search broadly, then filter
    .contains(elem.Value)
    .should("be.visible")
    .click({ force: true });
      // Wait for the dropdown options to appear
      // cy.get(".ui-menu-item")
      //   .contains(elem.Value, { timeout: 5000 }) // Adjust timeout as needed
      //   .should("be.visible") // Ensure the dropdown option is visible
      //   .click({ force: true }); // Select the matching option
    }
  });
  // cy.wait("@allRequests", { timeout: 60000 });
});



Cypress.Commands.add("enterTextInQuill", (value, elementSelector) => {
  cy.get(elementSelector)
    .should("be.visible")
    .then(($quillContainer) => {
      // Attempt to find the Quill editor within the container
      const quillEditor = $quillContainer.find(".ql-editor")[0];

      if (quillEditor) {
        // Use Quill's API to set content
        cy.wrap(quillEditor).type(value);
      } else {
        // Handle the case when Quill editor is not found
        throw new Error("Quill editor not found within the selected element");
      }
    });
});

Cypress.Commands.add("clearQuillContent", (elementSelector) => {
  cy.get(elementSelector)
    .should("be.visible")
    .then(($quillContainer) => {
      // Attempt to find the Quill editor within the container
      const quillEditor = $quillContainer.find(".ql-editor")[0];

      if (quillEditor) {
        // Use Quill's API to clear content
        cy.wrap(quillEditor).clear();
      } else {
        // Handle the case when Quill editor is not found
        throw new Error("Quill editor not found within the selected element");
      }
    });
});

