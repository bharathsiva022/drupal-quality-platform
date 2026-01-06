import { Given, When, Then, And } from '@badeball/cypress-cucumber-preprocessor';
import * as selectors from "../mappings-importer";
import { generateRandomNumber } from "../../methods/getRandomString";

When('the user selects {string} from the admin list', (contentType) => {
  cy.selectContentType(contentType);
})

When('the user enter the title {string} in the field {string}', (title, selector) => {
  cy.enterValueInField(title, selector);
});

When('the user enter the body {string} in the CKeditor field {string}', (body, selector) => {
  cy.get(selectors.drupal_CKeditor_source_editing_button).click();
  cy.enterValueInField(body, selector);
});

Then('I logout of the application', () => {
  cy.logout();
})

Then(' I will logout of the application', ()=>{
  
})

Then('I logout of the application and visit the {string} page', (aliasName) => {
  cy.logout();
  const targetUrl = Cypress.env(aliasName);
  expect(targetUrl).to.not.be.undefined;
  cy.visit(targetUrl);
});

Then('I check the page for visual correctness', () => {
  cy.eyesCheckCustom('Visual Check After Logout');
});

Given('I start visual testing with name {string}', (testName) => {
  cy.eyesOpenCustom(testName);
});

Then('I end visual testing', () => {
  cy.eyesCloseCustom();
});

When('the user navigates to {string}', (path) => {
  cy.visit(path);
})

Given('the user fill in the contact form', (dataTable) => {
  cy.fillForm(dataTable);
})

When('the user enters {string} in the text field', (text) => {
  cy.get('textarea').type(text);
});

When('the user click on the {string} button', (buttonText) => {
  cy.customClick(buttonText);
});

Then('the user should see the message {string}', (message) => {
  cy.contains(message).should('be.visible');
});

Then('the user clicks {string}', (element) => {
  cy.customClick(element);
})

When('the user selects {string} and click on {string}', (text, locator) => {
  cy.editRowWithTitle('table tbody', text)
})

Then('the user enters random title {string} in the field {string}', (text, locator) => {
  let dynamicMenuName = `${text}${generateRandomNumber()}`
  Cypress.env('menuName', dynamicMenuName);
  cy.enterValueInField(dynamicMenuName, locator)
})

When('I navigate to {string}', (path) => {
  cy.navigateToUrl(path);
})

When('I click on {string} button', (element) => {
  cy.customClick(element);
});

Then('I should see the message {string}', (message) => {
  cy.contains(message).should('be.visible');
});

Then('I should see the {string} in the main navigation menu {string}', (MenuTitle, elementSelector) => {
  cy.checkFieldContains(elementSelector, MenuTitle)
})

Given("I visit the {string} page", (path) => {
  cy.visitPage(path);
});

Given("I visit the homepage", () => {
  cy.visitPage("/");
});

Then("I should see {string}", (text) => {
  cy.contains(text).should('be.exist');
});

Then("I should see the block with selector {string}", (selector) => {
  cy.get(selectors[selector]).should('be.visible');
});

Then("the page should not contain any PHP or DB error", () => {
  cy.checkNoPhpError();
});

Given("I hover over the selector {string}", (selector) => {
  cy.hoverOnElement(selector);
});

Given("I click the element {string}", (selector) => {
  cy.clickElement(selectors[selector]);
});

Then("I should be on the homepage", () => {
  cy.url().should('eq', Cypress.config().baseUrl + "/");
});

Then("the element {string} should have CSS {string} containing {string}", (selector, property, value) => {
  cy.assertCssProperty(selector, property, value);
});

Then("the element {string} should be centered", (selector) => {
  cy.get(selector).should('have.css', 'margin-left', 'auto');
  cy.get(selector).should('have.css', 'margin-right', 'auto');
});

Then("I should see the element with selector {string}", (selector) => {
   cy.elementIsVisible(elemLocator);
});

Given("I set viewport to {int} and {int}", (width, height) => {
  cy.setResponsiveViewport(width, height);
});

Then("the responsive element {string} should be visible", (selector) => {
   cy.elementIsVisible(elemLocator);
});

Then("I should see the content title {string}", (title) => {
  cy.get("h1").contains(title).should('be.visible');
});

Then("I should see an image with selector {string}", (selector) => {
  cy.get(selectors[selector])
    .should('be.visible') // image is visible
    .and(($img) => {
      // Ensure it's an <img> element
      expect($img[0].tagName.toLowerCase()).to.equal('img');

      // Ensure it has a valid src
      const src = $img.attr('src');
      expect(src, 'Image src attribute').to.be.a('string').and.not.be.empty;

      // Ensure the image has loaded
      expect($img[0].naturalWidth, 'Image has loaded').to.be.greaterThan(0);
    });
});


Then("the element {string} should have class {string}", (selector, className) => {
  cy.get(selector).should('have.class', className);
});

Then("I should see the form element {string}", (selector) => {
  cy.get(selector).should('exist');
});

Then("I should see the button {string}", (text) => {
  cy.get('.button').contains(text).should('exist');
});

Then('the block {string} should contain {string}', (blockLoc, text) => {
  cy.get(blockLoc).contains(text).should('be.visible');
});

Then('the element {string} should be visible', (elemLocator) => {
  cy.elementIsVisible(elemLocator);
})

Then('I should see the link {string}', (linkText) => {
  cy.get('a').contains(linkText).should('exist');
})

Then('the page should not contain any JavaScript error', () => {
  cy.checkNoJsError();
})

Then('the header should still be visible', () => {
  cy.get('header').should('be.visible');
})

Then('I scroll to 500 pixels vertically', () => {
  cy.scrollTo(0, 500);
}) 

Then('the element {string} should have natural width greater than {int}', (elemLocator, num) => {
  cy.get(elemLocator).should('have.naturalWidth.greaterThan', num);
 })

 Then("the element {string} should have CSS {string} containing {string}", (selector, cssProp, expectedVal) => {
  cy.get(selector).should('have.css', cssProp).and('include', expectedVal);
});

Then("the element {string} should have CSS {string} not empty", (selector, cssProp) => {
  cy.get(selector).invoke('css', cssProp).should('not.be.empty');
});

Then("the responsive element {string} should be visible", (selector) => {
  cy.get(selector).should('be.visible');
});

Then("the element {string} should not be visible", (selector) => {
  cy.get(selector).should('not.be.visible');
});

Then("the element {string} should be below {string}", (selector1, selector2) => {
  cy.get(selector1).then(($el1) => {
    cy.get(selector2).then(($el2) => {
      expect($el1.offset().top).to.be.greaterThan($el2.offset().top);
    });
  });
});

Then("the element {string} should have CSS {string} less than {string}", (selector, cssProp, expectedValue) => {
  cy.get(selector).invoke('css', cssProp).then((val) => {
    const numericVal = parseFloat(val.replace(/[^\d.]/g, ''));
    const threshold = parseFloat(expectedValue.replace(/[^\d.]/g, ''));
    expect(numericVal).to.be.lessThan(threshold);
  });
});

When("I hover over the selector {string}", (selector) => {
  cy.get(selector).trigger('mouseover');
});

Then("I should see the dropdown {string}", (selector) => {
  cy.get(selector).should('be.visible');
});

Then("I should be on the homepage", () => {
  cy.url().should('match', /\/(home)?$/);
});

Then("the element {string} should not be visible", (selector) => {
  cy.get(selector).should('not.be.visible');
});
