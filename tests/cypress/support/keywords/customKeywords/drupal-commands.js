import * as selectors from "../../step_definitions/mappings-importer";
import "cypress-real-events/support";

Cypress.Commands.add("loginToDrupal", (username, password) => {
  cy.visit("/user/login");
  cy.get(selectors.login_username_field).type(Cypress.env(username), {
    force: true,
  });
  cy.get(selectors.login_password_field).type(Cypress.env(password), {
    force: true,
  });
  cy.fillCaptcha();
  cy.get(selectors.login_submit_button).should("be.visible").click();
});

Cypress.Commands.add("loginForVisual", (username, password) => {
  cy.visit("/user/login");
  cy.get(selectors.login_username_field).type(username, {
    force: true,
  });
  cy.get(selectors.login_password_field).type(password, {
    force: true,
  });
  cy.fillCaptcha();
  cy.get(selectors.login_submit_button).should("be.visible").click();
});

Cypress.Commands.add('logoutForVisual',()=>{
cy.visit("/user/logout");
cy.get(selectors.logout_button).click({force:true})
})

// fill captcha
Cypress.Commands.add("fillCaptcha", () => {
  cy.get(selectors.login_captcha_question).invoke('text').then((txt) => {
      const match = txt.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);

      if (match) {
        const num1 = parseInt(match[1], 10);
        const operator = match[2];
        const num2 = parseInt(match[3], 10);

        let result;

        switch (operator) {
          case '+':
            result = num1 + num2;
            break;
          case '-':
            result = num1 - num2;
            break;
          case '*':
            result = num1 * num2;
            break;
          case '/':
            result = Math.floor(num1 / num2);
            break;
          default:
            throw new Error('Unknown operator');
        }

        cy.get(selectors.login_captcha_field).type(result.toString());  
        
      } else {
        throw new Error('Captcha text pattern not found');
      }
    });
});


Cypress.Commands.add("selectContentType", (contentType) => {
  cy.get(selectors.drupal_content_type_selector).contains(contentType).click();
});

Cypress.Commands.add("verifyArticleCreation", () => {
  cy.url().should("include", "/node/");
  cy.get(".messages--status").should("contain", "has been created");
});

//trigger dialogue
Cypress.Commands.add("clickOnContentNavigationTab", (TabText) => {
  cy.get(".tabs--primary").contains(TabText).click();
});

Cypress.Commands.add("editRowWithTitle", (tableSelector, title) => {
  cy.get(tableSelector)
    .find("tr")
    .filter((index, $row) => {
      return Cypress.$($row).find("td").text().includes(title);
    })
    .first()
    .within(() => {
      cy.get(selectors.drupal_taxonomy_list_items_button).click();
    });
});

Cypress.Commands.add(
  "selectBlockContentAndEdit",
  (blockSelector, blockTitle, editButton) => {
    cy.get(selectors[blockSelector])
      .contains(blockTitle)
      .closest("tr")
      .within(() => {
        cy.contains(editButton).click();
      });
  }
);

Cypress.Commands.add("loginAs", (username, password, role) => {
  if (role === "Anonymous user") {
    cy.visit("/", { failOnStatusCode: false }); // Anonymous users don't need login
    return;
  } else {
    cy.visit("/user/login"); // Navigate to login page
    cy.get(selectors.login_username_field).type(username); // Enter username
    cy.get(selectors.login_password_field).type(password); // Enter password
    cy.get(selectors.login_submit_button).click(); // Submit the form
    cy.wait(2000);
  }
});

Cypress.Commands.add("logout", () => {
  cy.navigateToUrl("/user/logout");
   cy.customClick("content_delete_dialog_delete_button");
  // cy.url().should("eq", Cypress.config().baseUrl);
});


Cypress.Commands.add("filterName", (text) => {
  cy.get(selectors.baisc_filter_by_name_field).clear().type(text);
  cy.get(selectors.basic_filter_button).click();
});

Cypress.Commands.add("filterTitle", (text) => {
  cy.get(selectors.baisc_filter_by_title_field).clear().type(text);
  cy.get(selectors.basic_filter_button).click();
});

Cypress.Commands.add("editContentWithTitle", (contentTitle) => {
  cy.get(selectors.basic_table_locator).then(($rows) => {
    const matchingRow = $rows
      .filter((index, row) => {
        return Cypress.$(row).text().includes(contentTitle);
      })
      .first();
    cy.wrap(matchingRow)
      .find(
        ".dropbutton-wrapper > .dropbutton-widget > .dropbutton > .edit > a"
      )
      .click({ force: true });
  });
});

Cypress.Commands.add("deleteContentWithTitle", (title) => {
  cy.get(selectors.basic_table_locator).then(($rows) => {
    const matchingRow = $rows
      .filter((index, row) => {
        return Cypress.$(row).text().includes(title);
      })
      .first();
    cy.wrap(matchingRow)
      .find(selectors.content_edit_toggle_button)
      .click({ force: true });
    cy.wrap(matchingRow).find('a[href*="delete"]').click({ force: true });
    cy.get(selectors.confirmation_button).click({ force: true });
  });
});

Cypress.Commands.add("tableContains", (tableLocator, value) => {
  cy.get(selectors[tableLocator]).contains(value);
});

Cypress.Commands.add("tableNotContains", (tableLocator, value) => {
  cy.get(selectors[tableLocator]).should("not.contain", value);
});

Cypress.Commands.add("deleteContent", (title) => {
  cy.filterTitle(title);
  cy.get(selectors.basic_table_locator).then(($rows) => {
    const matchingRow = $rows
      .filter((index, row) => {
        return Cypress.$(row).text().includes(title);
      })
      .first();
    if (matchingRow.length) {
      cy.wrap(matchingRow)
        .find(selectors.content_edit_toggle_button)
        .click({ force: true });
      cy.wrap(matchingRow).find('a[href*="delete"]').click({ force: true });
      cy.get(selectors.confirmation_button).click({ force: true });
    }
  });
});

Cypress.Commands.add("verifyContentExists", (title, body = null) => {
  if (title) {
    cy.get(selectors.basic_page_title).should("contain", title);
  }
  if (body) {
    cy.get(selectors.basic_page_body_summary).should("contain", body);
  }
});

Cypress.Commands.add("verifyContentNotExists", (title) => {
  cy.get(selectors.basic_table_locator).should("not.contain", title);
});

Cypress.Commands.add("validateSiteStatus", (type) => {
  cy.get("body").then(($body) => {
    if ($body.find(`div:contains("${type}")`).length > 0) {
      cy.get(`div:contains("${type}")`)
        .should("be.visible")
        .then(($element) => {
          const count = parseInt($element.text().match(/\d+/)[0]);
          cy.log(`⚠️ ${count} ${type} found`);

          if (count > 0) {
            assert.fail(`${count} ${type} found! Test failed.`);
          }
        });
    } else {
      cy.log(`✅ No ${type} found`);
    }
  });
});
