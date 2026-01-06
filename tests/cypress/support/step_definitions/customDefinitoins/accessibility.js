const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");

let pages = [];
let reports = [];

Given("I load the pages from fixture {string}", (fixtureFile) => {  
  cy.fixture(`visualRegression/${fixtureFile}`).then((data) => {
    if (!data || typeof data !== "object") {
      throw new Error(`Fixture '${fixtureFile}' must be an object`);
    }
    pages = Object.values(data);
  });
});

When("I run accessibility checks for {int} pages from {string} file", (pageCount, fixtureFile) => {
  cy.then(() => {
    if (pages.length === 0) {
      throw new Error(`No pages loaded from fixture '${fixtureFile}'`);
    }
    const pagesToTest = Math.min(pageCount, pages.length);
    
    const selectedPages = getRandomPages(pages, pagesToTest);

    cy.wrap(selectedPages).each((page) => {
      const baseUrl = Cypress.config('baseUrl');
      const url = `${baseUrl}${page.url}`;
      
      if (page.auth) {
        const username = Cypress.env('username');
        const password = Cypress.env('password');
        cy.loginForVisual(username, password);
      } else {
        cy.clearCookies();
        cy.clearLocalStorage();
      }

      cy.visit(url, { failOnStatusCode: false });
      cy.injectAxe();

      const pageResult = {
        testName: page.testName,
        url: url,
        passed: true,
        violations: []
      };
      reports.push(pageResult);
      const currentIndex = reports.length - 1;

      cy.checkA11y(
        null,
        {
          runOnly: {
            type: "rule",
            values: [
              "image-alt",
              "aria-roles",
              "label",
              "aria-valid-attr-value",
             // 'color-contrast',
              "aria-hidden-focus",
              "heading-order"
            ]
          }
        },
        (violations) => {
          if (violations && violations.length > 0) {
            reports[currentIndex].passed = false;
            reports[currentIndex].violations = violations.map((v) => ({
              id: v.id,
              impact: v.impact,
              description: v.description,
              help: v.help,
              helpUrl: v.helpUrl,
              tags: v.tags,
              nodes: v.nodes.map((node) => ({
                html: node.html,
                target: node.target,
                failureSummary: node.failureSummary,
                element: node.target ? node.target[0] : null,
                impact: node.impact,
                any: node.any?.map(check => ({
                  id: check.id,
                  message: check.message
                })),
                all: node.all?.map(check => ({
                  id: check.id,
                  message: check.message
                })),
                none: node.none?.map(check => ({
                  id: check.id,
                  message: check.message
                }))
              }))
            }));
          }
        },
        { skipFailures: true }
      );
      if (page.auth) {
        cy.logoutForVisual(); 
      }
    });
  });
});

function getRandomPages(allPages, count) {
  if (count >= allPages.length) {
    return [...allPages]; 
  }
  const shuffled = [...allPages].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

Then("I generate a accessibility report", () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonReportPath = `cypress/reports/Accessibility/accessibility-report-${timestamp}.json`;
  const htmlReportPath = `cypress/reports/Accessibility/accessibility-report-${timestamp}.html`;
  
  const totalUrls = reports.length;
  const passedUrls = reports.filter(report => report.passed).length;
  const failedUrls = reports.filter(report => !report.passed).length;
  const totalViolations = reports.reduce((sum, report) => sum + report.violations.length, 0);
  const totalElementsWithIssues = reports.reduce((sum, report) => 
    sum + report.violations.reduce((violationSum, violation) => 
      violationSum + violation.nodes.length, 0), 0);

  const finalReport = {
    summary: {
      totalUrls: totalUrls,
      passedUrls: passedUrls,
      failedUrls: failedUrls,
      passRate: totalUrls > 0 ? `${Math.round((passedUrls / totalUrls) * 100)}%` : "0%",
      totalViolations: totalViolations,
      totalElementsWithIssues: totalElementsWithIssues,
      timestamp: new Date().toISOString()
    },
    results: reports
  };

  cy.writeFile(jsonReportPath, finalReport, { flag: "w" });

  const htmlReport = generateHTMLReport(finalReport);
  cy.writeFile(htmlReportPath, htmlReport, { flag: "w" });
});

function generateHTMLReport(reportData) {
  const { summary, results } = reportData;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .summary-card { background: white; padding: 15px; border-radius: 6px; text-align: center; border-left: 4px solid #007cba; }
        .passed { border-left-color: #28a745; }
        .failed { border-left-color: #dc3545; }
        .violations { border-left-color: #ffc107; }
        .number { font-size: 24px; font-weight: bold; margin: 5px 0; }
        .page-result { margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 6px; }
        .page-passed { background: #d4edda; border-color: #c3e6cb; }
        .page-failed { background: #f8d7da; border-color: #f5c6cb; }
        .violation { background: #fff3cd; margin: 10px 0; padding: 10px; border-radius: 4px; border-left: 4px solid #ffc107; }
        .critical { border-left-color: #dc3545; background: #f8d7da; }
        .serious { border-left-color: #fd7e14; background: #ffe5d0; }
        .moderate { border-left-color: #ffc107; background: #fff3cd; }
        .minor { border-left-color: #20c997; background: #d1f2eb; }
        .node { background: white; margin: 5px 0; padding: 8px; border-radius: 4px; font-family: monospace; font-size: 12px; }
        .timestamp { color: #6c757d; font-size: 14px; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Accessibility Test Report</h1>
        <div class="timestamp">Generated on: ${summary.timestamp}</div>
        
        <div class="summary">
            <h2>📊 Summary</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <div>Total URLs Tested</div>
                    <div class="number">${summary.totalUrls}</div>
                </div>
                <div class="summary-card passed">
                    <div>Passed URLs</div>
                    <div class="number">${summary.passedUrls}</div>
                </div>
                <div class="summary-card failed">
                    <div>Failed URLs</div>
                    <div class="number">${summary.failedUrls}</div>
                </div>
                <div class="summary-card">
                    <div>Pass Rate</div>
                    <div class="number">${summary.passRate}</div>
                </div>
                <div class="summary-card violations">
                    <div>Total Violations</div>
                    <div class="number">${summary.totalViolations}</div>
                </div>
                <div class="summary-card violations">
                    <div>Elements with Issues</div>
                    <div class="number">${summary.totalElementsWithIssues}</div>
                </div>
            </div>
        </div>

        <h2>📄 Detailed Results</h2>
        ${results.map(page => `
            <div class="page-result ${page.passed ? 'page-passed' : 'page-failed'}">
                <h3>${page.testName} <span style="color: ${page.passed ? '#28a745' : '#dc3545'}">(${page.passed ? '✅ PASSED' : '❌ FAILED'})</span></h3>
                <div><strong>URL:</strong> ${page.url}</div>
                ${page.violations.length > 0 ? `
                    <div><strong>Violations:</strong> ${page.violations.length}</div>
                    ${page.violations.map(violation => `
                        <div class="violation ${violation.impact || 'moderate'}">
                            <h4>${violation.id} <span class="impact">(${violation.impact || 'unknown'})</span></h4>
                            <p><strong>Description:</strong> ${violation.description}</p>
                            <p><strong>Help:</strong> ${violation.help} <a href="${violation.helpUrl}" target="_blank">Learn more</a></p>
                            <div><strong>Affected Elements (${violation.nodes.length}):</strong></div>
                            ${violation.nodes.map(node => `
                                <div class="node">
                                    <div><strong>Element:</strong> ${node.element || 'N/A'}</div>
                                    <div><strong>HTML:</strong> <code>${node.html || 'N/A'}</code></div>
                                    ${node.failureSummary ? `<div><strong>Issue:</strong> ${node.failureSummary}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                ` : '<div>✅ No accessibility violations found</div>'}
            </div>
        `).join('')}
    </div>
</body>
</html>
  `;
}