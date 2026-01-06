const report = require("multiple-cucumber-html-reporter");

report.generate({
  jsonDir: "cypress/reports/cucumber-report",
  reportPath: "cypress/reports/cucumber-report/cucumber-html",
  reportName: "Cypress Cucumber Test Report",
  pageTitle: "Automation Test Results",

  metadata: {
    browser: {
      name: "chrome",
    },
    device: "Test Machine",
    platform: {
      name: "Windows",
    },
  },
});
