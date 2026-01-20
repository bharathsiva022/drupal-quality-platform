const { Given, Then } = require("@badeball/cypress-cucumber-preprocessor");


let currentEnv;

Given("I load the site configuration based on environment", () => {
  currentEnv = Cypress.env("configFile") || "dev";
});

Then("the shield status should match the environment", () => {
  const urlToTest = Cypress.config("baseUrl");
  cy.request({
    url: urlToTest,
    failOnStatusCode: false,
  }).then((response) => {
    const hasShield =
      response.status === 401 &&
      response.headers["www-authenticate"]?.includes("Basic");

    const protectedEnvs = ["dev", "uat", "test"];
    const shouldHaveShield = protectedEnvs.some((env) =>
      currentEnv.toLowerCase().includes(env)
    );

    if (shouldHaveShield) {
      expect(hasShield, `Shield should be ENABLED in ${currentEnv}`).to.be.true;
    } else {
      expect(hasShield, `Shield should be DISABLED in ${currentEnv}`).to.be.false;
    }
  });
});

Then("large images should be lazy loaded", () => {
  const viewportHeight = Cypress.config("viewportHeight");
  let hasAtLeastOneLazyElement = false;
  let offScreenCount = 0;

  cy.get("img:visible, iframe:visible").each(($el) => {
    const rect = $el[0].getBoundingClientRect();
    if (rect.top > (viewportHeight + 100)) {
      offScreenCount++;

      const loadingAttr = $el.attr("loading");
      const dataSrc = $el.attr("data-src") || $el.attr("data-lazy") || $el.attr("data-srcset");

      if (loadingAttr === "lazy" || !!dataSrc) {
        hasAtLeastOneLazyElement = true;
      }
    }
  }).then(() => {
    expect(offScreenCount, "No off-screen images found! Ensure the page has enough content to scroll.")
      .to.be.greaterThan(0);

    expect(hasAtLeastOneLazyElement, 
      `Lazy loading check failed: Out of ${offScreenCount} off-screen elements, none had 'loading="lazy"' or data-src attributes.`
    ).to.be.true;

    cy.log(`Lazy loading is active! Verified ${offScreenCount} off-screen elements.`);
  });
});