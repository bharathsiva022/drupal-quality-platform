import { Given, When, And, Then, DataTable } from "@badeball/cypress-cucumber-preprocessor";
import * as selectors from "../mappings-importer";

Given('the user navigates to the content creation page {string}', (url) => {
    cy.visit(url, { failOnStatusCode: false });
});

Given('the user navigates to the content listing page {string}', (url) => {
    cy.visit(url);
});

Then('the user should see a field labeled {string}', (label) => {
    cy.get('#edit-field-contact-date-and-time-wrapper').contains(label)  // Ensure the label exists
});

When('the user select {string} from {string} to publish the article', (option, dropdownSelection) => {
    cy.selectFromDropdown(option, dropdownSelection)
})

Then('the article should be created successfully', () => {
    cy.verifyArticleCreation();
});

Then('the user filter for unpublished content {string} and clicks on {string} to edit', (contentTitle, editButtonLocator) => {
    cy.get('#edit-title').clear().type(contentTitle);
    cy.get('input[value="Filter"]').click();

    cy.get('table tbody tr').then($rows => {
        Cypress.$($rows).each((index, row) => {
            const $row = Cypress.$(row);

            const titleText = $row.find('td.views-field-title').text().trim();
            const statusText = $row.find('td.views-field-status').text().trim();

            if (titleText === contentTitle && statusText === 'Unpublished') {
                cy.wrap($row).find(selectors[editButtonLocator]).click();
                return false;
            }
        });
    });
});

Then('the article {string} should be published', (articleName) => {
    cy.visit('/admin/content');
    cy.get('input[name="title"]').type(articleName);
    cy.get('input[id="edit-submit-content"]').click();

    cy.get('table tbody tr').then($rows => {
        Cypress.$($rows).each((index, row) => {
            const $row = Cypress.$(row);
            const titleText = $row.find('td.views-field-title').text().trim();
            if (titleText === articleName) {
                cy.wrap($row).find('td.views-field-status').invoke('text').then((text) => {
                    expect(text.trim()).to.equal('Published');
                });
                return false;
            }
        });
    });
})

Then('the user log out of the application as the content is created successfully', () => {
    cy.get(selectors.drupal_account_logout).click({ force: true })
})

When('the user filter for Article {string} and clicks on {string} to navigate to edit page', (contentTitle, editButtonLocator) => {
    cy.get('#edit-title').clear().type(contentTitle);
    cy.get('input[value="Filter"]').click();

    cy.get('table tbody tr').then($rows => {
        Cypress.$($rows).each((index, row) => {
            const $row = Cypress.$(row);

            const titleText = $row.find('td.views-field-title').text().trim();
            const statusText = $row.find('td.views-field-status').text().trim();

            if (titleText === contentTitle && statusText === 'Published') {
                cy.wrap($row).find(selectors[editButtonLocator]).click();
                return false;
            }
        });
    });
})

Then('the user delete the Article', () => {
    cy.clickOnContentNavigationTab('Delete')
    cy.get(selectors.drupal_content_edit_actions).contains('Delete').click({ force: true })
})

When('the user navigate to {string} to add user', (path) => {
    cy.visit(path);
})

When('the user clicks on {string} button to navigate to create user page', (buttonselector) => {
    cy.customClick(buttonselector);
})

When('the user enters mandtotory field values to create a user', (dataTable) => {
    cy.fillForm(dataTable);
})

Then('the test user {string} is deleted from the system', (username) => {
    cy.get('#edit-user').clear().type(username);
    cy.get('input[value="Filter"]').click();

    cy.get('table tbody tr').then($rows => {
        Cypress.$($rows).each((index, row) => {
            const $row = Cypress.$(row);

            const titleText = $row.find('td.views-field > a').text().trim();
            const statusText = $row.find('td.views-field-status').text().trim();

            if (titleText === username && statusText === 'Blocked') {
                cy.wrap($row).find("td.views-field-operations a[href*='/edit']").click({ force: true });
                return false;
            }
        });
    });
    cy.customClick('drupal_cancel_account_button')
    cy.customClick('drupal_delete_user_account')
    cy.customClick('Confirm')
    cy.contains(`Account ${username} has been deleted.`)
})

Then('the user should see the message stating the successful Menu creation', () => {
    const menuName = Cypress.env('menuName');
    const expectedMessage = `Menu ${menuName} has been added.`;
    cy.contains(expectedMessage).should('be.visible');
})

Then('the user adds a link {string} with the path {string} to the {string}', (title, link, linkLocator) => {
    cy.enterValueInField(title, 'drupal_menu_link_title')
    cy.enterValueInField(link, linkLocator)
    cy.customClick('druapl_menu_link_submit_button');
})

Then('the link {string} should be added to the menu', (linkTitle) => {
    cy.contains(Cypress.env('menuName'));
    cy.get('table tbody tr').then($rows => {
        Cypress.$($rows).each((index, row) => {
            const $row = Cypress.$(row);
            const titleText = $row.find('td.tabledrag-cell > div > div').text().trim();
            cy.wrap($row).contains(linkTitle)
            return false;
        })
    })
})

Then('the user selects the {string} region from {string} and clicks on {string}', (blockSelector, blockTitle, editButton) => {
    cy.selectBlockContentAndEdit(blockTitle, blockSelector, editButton);
})

Then('the user selects the {string} block  from {string} and clicks on {string}', (blockSelector, blockTitle, editButton) => {
    cy.selectBlockContentAndEdit(blockTitle, blockSelector, editButton);
})

When('the user clicks the {string} button at {string}', (buttonText, locator) => {
    cy.get(selectors[locator]).contains(buttonText).click();
});

When('the user selects {string} from config page {string}', (option, locator) => {
    cy.get(selectors[locator]).contains(option).click();
})

When('the user enables maintenance mode by clicking on {string} checkbox', (locator) => {
    cy.get(selectors[locator]).then($checkbox => {
        if ($checkbox.is(':checked')) {
            cy.wrap($checkbox).uncheck();
        }
    })
    cy.customClick(locator);
})

When('the user disable maintenance mode by clicking on {string} checkbox', (locator) => {
    cy.get(selectors[locator]).then($checkbox => {
        if ($checkbox.is(':checked')) {
            cy.wrap($checkbox).uncheck();
        }
    })
})

When('the site should be in maintenance mode', () => {
    cy.get(selectors.drupal_config_maintenance_mode_message_area).contains('site is currently under maintenance')
})

When('the user deletes the menu {string}', (menuName) => {
    cy.visit('/admin/structure/menu')
    const name = Cypress.env('menuName')
    const nametoLower = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    cy.contains(name).parent().within(() => {
        cy.get(`li > a[href*="/menu/manage/${nametoLower}"]`).contains('Edit menu').click();
    });
    cy.get('form').within(() => {
        cy.get(selectors.drupal_content_edit_actions).contains('Delete').click();
    });
    cy.get(selectors.drupal_basic_action_input_submit).contains('Delete').click({ force: true });
});

When('the user deletes the taxonomy term {string}', (termName) => {
    cy.visit('/admin/structure/taxonomy/manage/tags/overview')
    cy.contains(termName).parents().eq(3).within(() => {
        cy.get(selectors.drupal_taxonomy_manage_overview).contains('Edit').click();
    });
    cy.get('form').within(() => {
        cy.get(selectors.drupal_content_edit_actions).contains('Delete').click();
    });
    cy.get(selectors.drupal_basic_action_input_submit).contains('Delete').click({ force: true });
});

When('the user deletes the block {string} from the {string} region', (blockName, regionName) => {
    cy.visit('/admin/structure/block');

    // Locate the row for the region
    cy.contains('tr', regionName).then(($regionRow) => {
        // Get the next rows until we find the block or reach the end of the region section
        cy.wrap($regionRow).nextUntil(':not(tr)').each(($row) => {
            // Check if the current row contains the block name
            if ($row.text().includes(blockName)) {
                cy.wrap($row).within(() => {
                    cy.get(selectors.drupal_basic_dropdown_actions).contains('Remove').click({ force: true });
                });
            }
        });
    });
    cy.get(selectors.drupal_basic_action_input_submit).contains('Remove').click({ force: true });
});


