import * as selectors from "../mappings-importer";
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// Content type CRUD operations - Standalone

When(
  "I create a {string} with the following details:",
  (contentType, dataTable) => {
    cy.createContent(contentType, dataTable); // Custom command for content creation
  }
);

Then('I should see a success message {string}', (successMessage) => {
  cy.checkPageSuccessContainsValue(successMessage)
});


Then('I should see a edit success message {string}', (successMessage) => {
  cy.checkPageSuccessContainsValue(successMessage)
});

Then('I capture the page url as {string}', (aliasName) => {
  cy.url().then((url) => {
    Cypress.env(aliasName, url);
  });
});

Then('I should see the {string} in the page title', (pageTitle) => {
 cy.title().should('include', pageTitle);

})

Then('I publish the page', () => {
  // cy.get(selectors.content_publish_button).click();
  cy.get('#edit-moderation-state-0-state0').select('Published');
})

Then("I should see the career page with all the sections", () => {
  cy.checkField("content_career_page_intro_section", "be.visible");
  cy.checkField("content_career_page_position_section", "be.visible");
  cy.checkField("content_career_page_responsibilities_section", "be.visible");
  cy.checkField("content_career_page_requirements_section", "be.visible");
  cy.checkField("content_career_page_contact_form", "be.visible");
});

Then("I should see the course page with all the sections", () => {
  cy.checkField("content_course_table", "be.visible");
  cy.checkField("content_course_resource_topics_table", "be.visible");
});

Then("I should see the feature profile page with all the elements", () => {
  cy.get(selectors.content_feature_profile_wrapper_1).within(() => {
    cy.checkField("content_feature_profile_image_container", "be.visible");
    cy.checkField("content_feature_profile_cta_container", "be.visible");
  });
  cy.get(selectors.content_feature_profile_wrapper_2).within(() => {
    cy.checkField("content_feature_profile_name_container", "be.visible");
    cy.checkField("content_feature_profile_subtitle_container", "be.visible");
    cy.checkField(
      "content_feature_profile_description_container",
      "be.visible"
    );
  });
});

Then("I should see the magazine page with all the elements", () => {
  cy.get(".magazine__content").within(() => {
    cy.get('[class="magazine__left"]').within(() => {
      cy.checkField("content_magazine_page_body", "be.visible");
    });
    cy.get('[class="magazine__right"]').within(() => {
      cy.checkField("content_magazine_page_image", "be.visible");
      cy.checkField("content_magazine_page_file", "be.visible");
      cy.checkField("content_magazine_page_articles", "be.visible");
    });
  });
});

Then("I should see the resource page with all the sections", () => {
  cy.get(".resource__wrapper").within(() => {
    cy.checkField("content_resource_page_details_table_data_row", "be.visible");
    cy.checkField(
      "content_resource_page_resource_table_data_row",
      "be.visible"
    );
    cy.checkField(
      "content_resource_page_categories_table_data_row",
      "be.visible"
    );
  });
});

Then("I should see the article page with all the elements", () => {
  cy.get(selectors.content_article_hero_image_container)
    .should('be.visible')
    .should('have.attr', 'style')
    .and('include', 'amazonaws.com');

  cy.checkField("content_article_page_title", "be.visible");
  cy.checkField("content_article_page_block_content", "be.visible");
  cy.get('body').then($body => {
    if ($body.find('.sidebar-nav').length > 0) {
      cy.get('.sidebar-nav').should('be.visible');
      cy.get('.sidebar-nav__title').should('be.visible');
      cy.get('.sidebar-nav__links').should('have.length.greaterThan', 0);
    } else {
      cy.log('Sidebar not present, skipping assertions.');
    }
  });

});

Then("I add the following credit types:", (dataTable) => {
  const creditTypes = dataTable.raw().flat();
  cy.manageMultiValueField("Credit Type", "add", creditTypes);
});
Then(
  "I should see the test page {string} in the content table",
  (pageTitle) => {
    cy.get(selectors.basic_table_locator).should("contain", pageTitle);
  }
);

Then(
  "I should see the title {string} and body {string} on the page",
  (title, body) => {
    cy.verifyContentExists(title, body); // Custom command for verifying content
  }
);

Then("I should see the title {string} on the billboard", (title) => {
  cy.verifyContentExists(title); // Custom command for verifying content
});

Then("I should see the {string} on the News Page", (newsTitle) => {
  cy.verifyContentExists(newsTitle);
});

When(
  "I add the section {string} from edit layout for {string}",
  (sectionType, contentTitle, dataTable) => {
    cy.clickOnEditContent(contentTitle);
    cy.get(".tabs").contains("Layout").click({ force: true });
    cy.addSection(0, sectionType, dataTable);
  }
);

When("I edit the content {string} and navigate to layout page", (content) => {
  cy.clickToViewContent(content);
  cy.get("[class='tabs__tab js-tab']").contains("Layout").click({ force: true });
});

When("I click on {string} to view the page", (tab) => {
  cy.get("[data-drupal-link-system-path='node/1669']").contains(tab).click({ force: true });
});

Then("I click on the {string} from content page to view", (contentTitle) => {
  cy.visit("/admin/content");
  cy.filterTitle(contentTitle);
  cy.get("table tbody tr").then(($rows) => {
    const matchingRow = $rows
      .filter((index, row) => {
        return Cypress.$(row).text().includes(contentTitle);
      })
      .first();
    cy.wrap(matchingRow)
      .find(selectors.content_table_item)
      .should("be.visible")
      .click({ force: true });
  });
});

When("I click on {string} button from primary navigation tab", (value) => {
  cy.clickValueInField(value, "primary_navigation_tab");
});

Then(
  "I add the block {string} to the section index {int} with the details:",
  (blockType, sectionIndex, dataTable) => {
    cy.addBlock(blockType, sectionIndex, dataTable);
  }
);

Then("I should see the section with title {string}", (sectionTitle) => {
  cy.get(selectors.basic_node_content)
    .should("be.visible")
    .contains(sectionTitle);
});

Then("I should see the button text {string}", (text) => {
  cy.get(selectors.basic_cta_button).should("contain", text);
});
Then("I should see the block {string}", (blockLocator) => {
  cy.get(selectors[blockLocator]).should("be.visible").and("exist");
});

Then("I should see the news content at {string}", (blockLocator) => {
  cy.get(selectors[blockLocator]).should("be.visible").and("exist");
});

When("I edit the {string} with the details:", (contentType, dataTable) => {
  cy.clickOnEditContent(contentType);
  cy.fillForm(dataTable); // Custom command for content editing
});

When("I delete the {string}", (title) => {
  cy.deleteContent(title); // Custom command for content deletion
});

When("I delete the news page {string}", (title) => {
  cy.deleteContent(title); // Custom command for content deletion
});

When("I delete the landing page {string}", (title) => {
  cy.deleteContent(title); // Custom command for content deletion
});
Then("I should not see the {string} anymore", (title) => {
  cy.verifyContentNotExists(title); // Custom command to verify deletion
});

When("I assign the {string} to the {string} menu", (title, menu) => {
  cy.assignToMenu(title, menu); // Custom command for assigning to menu
});

When(
  "I set permissions for {string} to be viewable by {string}",
  (title, userRole) => {
    cy.setContentPermissions(title, userRole); // Custom command for setting permissions
  }
);

When("I assign the {string} to the {string} workflow", (title, workflow) => {
  cy.assignToWorkflow(title, workflow); // Custom command for assigning to a workflow
});

Then("I should see the {string} on the front-end", (title) => {
  cy.verifyContentOnFrontEnd(title); // Custom command for front-end verification
});

Then(
  "I add the default layout to the {string} landing page",
  (landingPageTitle, dataTable) => {
    cy.get(selectors.primary_action_tab).contains("Edit").click();
    cy.fillForm(dataTable);
  }
);

Then(
  "I should see the content type {string} in the content types page",
  (contentType) => {
    cy.visit("/admin/structure/types");
    cy.get("table").contains(contentType);
  }
);

Then("I should {string} list item in the page", (contentItem) => {
  cy.contains(contentItem).should("be.visible");
});

Then("I validate the brochrure {string} exists", (brochureTitle) => {
  cy.get(selectors.content_brochure_title).should("contain", brochureTitle);
  cy.elementIsVisible("content_brochure_image");
  cy.elementIsVisible("content_brochure_description");
  cy.elementIsVisible("content_brochure_options");
});
