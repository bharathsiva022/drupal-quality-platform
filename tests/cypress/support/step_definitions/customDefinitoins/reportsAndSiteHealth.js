const {
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");
import * as selectors from "../mappings-importer";

Then("I should see zero {string} in the status report", (type) => {
  cy.validateSiteStatus(type);
});

Then("I should see the cron run interval set to {string}", (interval) => {
  cy.get('select[id="edit-interval"]').should("contain", interval);
});

Then(
  "I should see that detailed cron logging is {string}",
  (detailedCronLog) => {
    if (detailedCronLog === "enabled") {
      cy.get('input[id="edit-logging"]').should("exist").and("be.checked");
    } else if (detailedCronLog === "disabled") {
      cy.get('input[id="edit-logging"]').should("exist").and("not.be.checked");
    }
  }
);

When("I verify that the last cron run was within {string}", (interval) => {
  const hoursThreshold = parseInt(interval);
  cy.get("#system-cron-settings > p:nth-child(3) > em")
    .invoke("text")
    .then((lastRunTimeText) => {
      const [value, unit] = lastRunTimeText.trim().split(" ");
      const timeValue = parseInt(value);
      if (isNaN(timeValue)) {
        throw new Error(
          `Unable to parse last run time value: ${lastRunTimeText}`
        );
      }
      // Convert the time to hours based on the unit
      let hoursSinceLastRun;
      switch (unit) {
        case "seconds":
          hoursSinceLastRun = timeValue / 3600;
          break;
        case "minutes":
          hoursSinceLastRun = timeValue / 60;
          break;
        case "hour":
          hoursSinceLastRun = timeValue;
          break;
        case "hours":
          hoursSinceLastRun = timeValue;
          break;
        case "days":
          hoursSinceLastRun = timeValue * 24;
          break;
        case "day":
          hoursSinceLastRun = timeValue * 24;
          break;
        default:
          throw new Error(`Unknown time unit: ${unit}`);
      }

      // Verify that hours since last run is within the threshold
      expect(hoursSinceLastRun).to.be.lessThan(
        hoursThreshold,
        `Last cron run was more than ${hoursThreshold} hours ago`
      );
    });
});

When("I check for the broken links in the current environment", () => {
  cy.task("runLinkChecker", null, { timeout: 60000 }).then((result) => {
    cy.log("Link check completed.");
  });
});
