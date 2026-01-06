const {
  Given,
  When,
  Then,
} = require("@badeball/cypress-cucumber-preprocessor");


const results = {};
const htmlOutput = [];
let currentPageKey = null;


const captureConsole = (pageKey) => {
  Cypress.on('window:before:load', (win) => {
    const origError = win.console.error;
    const origWarn = win.console.warn;

    win.console.error = (...args) => {
      if (results[pageKey]) {
        results[pageKey].errors.push(args.join(' '));
      }
      origError.apply(win.console, args);
    };

    win.console.warn = (...args) => {
      if (results[pageKey]) {
        results[pageKey].warnings.push(args.join(' '));
      }
      origWarn.apply(win.console, args);
    };
  });
};

Given('I visit {int} pages from the JSON file {string}', (pageCount, jsonFile) => {
  cy.fixture(`visualRegression/${jsonFile}`).then((pages) => {
    const entries = Object.entries(pages);
    const totalPages = entries.length;
    const pagesToVisit = entries.slice(0, Math.min(pageCount, totalPages));

    cy.log(`📘 Using JSON file: ${jsonFile}`);
    cy.log(`🔍 Checking ${pagesToVisit.length} out of ${totalPages} available pages...`);

    pagesToVisit.forEach(([pageKey, pageData], index) => {
      cy.then(() => {
        cy.log(`🌐 Checking page: ${pageData.testName}`);

        const url = (Cypress.config('baseUrl') + pageData.url).replace(/([^:]\/)\/+/g, '$1');


        // Set current page key for network capture
        currentPageKey = pageKey;

        results[pageKey] = {
          url,
          name: pageData.testName,
          errors: [],
          warnings: [],
          network: [],
        };

        // Setup network intercept BEFORE visiting the page
        cy.intercept('**', (req) => {
          req.on('response', (res) => {
            // Only capture for the current page
            if (currentPageKey === pageKey) {
              const is404 = res.statusCode === 404;
              const is500 = res.statusCode === 500;

              if (is404 || is500) {
                const errorMsg = `${req.method} ${req.url} → ${res.statusCode}`;
                results[pageKey].network.push(errorMsg);
              }
            }
          });
        }).as(`network_${pageKey}`);

       
        if (pageData.auth) {
          const username = Cypress.env('username');
          const password = Cypress.env('password');
          cy.loginForVisual(username, password);
        } else {
          cy.clearCookies();
          cy.clearLocalStorage();
        }

        captureConsole(pageKey);

        // Visit the page
        cy.visit(url, { failOnStatusCode: false });

        // Wait for body to ensure page loaded
        cy.get('body', { timeout: 15000 }).should('be.visible');

        // Wait for network requests to complete
        cy.wait(2000);

        // Clear current page key to stop capturing
        cy.then(() => {
          currentPageKey = null;

          // Remove duplicates per page
          results[pageKey].network = [...new Set(results[pageKey].network)];
          results[pageKey].errors = [...new Set(results[pageKey].errors)];
          results[pageKey].warnings = [...new Set(results[pageKey].warnings)];

          cy.log(`✅ Captured for ${pageKey}: ${results[pageKey].network.length} network errors`);
        });
      });
    });
  });
});

Then('I capture and display all console and network errors for each page', () => {
  cy.then(() => {
    cy.log('==================== ERROR SUMMARY ====================');

    htmlOutput.length = 0; // Clear array

    htmlOutput.push(`
      <html>
      <head>
        <title>Console and Network Error Summary</title>
        <style>
          body { font-family: Arial, sans-serif; background: #fafafa; color: #333; margin: 40px; }
          h1 { text-align: center; color: #222; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #fff; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; word-break: break-word; }
          th { background-color: #f0f0f0; color: #000; font-weight: bold; }
          .serial, .page-url { color: black; font-weight: bold; }
          .pass { color: green; font-weight: bold; }
          .fail { color: red; font-weight: bold; }
          tr.pass { background-color: #f0fff0; }
          tr.fail { background-color: #fff0f0; }
          .error-cell { max-width: 400px; }
          footer { margin-top: 40px; text-align: center; font-size: 12px; color: #555; }
        </style>
      </head>
      <body>
        <h1>Console & Network Error Summary</h1>
        <table>
          <thead>
            <tr>
              <th>Serial</th>
              <th>Page URL</th>
              <th>Errors</th>
              <th>Warnings</th>
              <th>Network Errors</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
    `);

    let serial = 1;
    let totalPass = 0;
    let totalFail = 0;

    Object.entries(results).forEach(([pageKey, logs]) => {
      const status = (logs.errors.length || logs.network.length) ? 'Fail' : 'Pass';
      const statusClass = status === 'Pass' ? 'pass' : 'fail';

      if (status === 'Pass') totalPass++;
      else totalFail++;

      htmlOutput.push(`
        <tr class="${statusClass}">
          <td class="serial">${serial}</td>
          <td class="page-url"><a href="${logs.url}" target="_blank">${logs.name || logs.url}</a></td>
          <td class="error-cell">${logs.errors.length ? logs.errors.join('<br><br>') : 'None'}</td>
          <td class="error-cell">${logs.warnings.length ? logs.warnings.join('<br><br>') : 'None'}</td>
          <td class="error-cell">${logs.network.length ? logs.network.join('<br><br>') : 'None'}</td>
          <td class="${statusClass}">${status}</td>
        </tr>
      `);

      serial++;
    });

    htmlOutput.push(`
          </tbody>
        </table>
        <div style="margin-top: 30px; text-align: center; font-size: 18px;">
          <strong>Summary:</strong> 
          <span style="color: green;">✓ ${totalPass} Passed</span> | 
          <span style="color: red;">✗ ${totalFail} Failed</span> | 
          <strong>Total: ${totalPass + totalFail} pages</strong>
        </div>
        <footer>
          <p>Report generated on: ${new Date().toLocaleString()}</p>
        </footer>
      </body>
      </html>
    `);

    const fileName = `console-network-errors-${new Date().getTime()}.html`;
    cy.writeFile(`cypress/reports/console-errors/${fileName}`, htmlOutput.join(''));
    cy.log(`✅ HTML summary saved as ${fileName}`);
    cy.log(`📊 Summary: ${totalPass} Passed, ${totalFail} Failed`);
  });
});






