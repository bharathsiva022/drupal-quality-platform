Cypress.Commands.add('eyesOpenCustom', (testName = 'Default Test') => {
    const appName = Cypress.env('applitoolsAppName') || 'Default App';
    const batchName = Cypress.env('applitoolsBatchName') || 'Default Batch';
    cy.eyesOpen({
        appName,
        testName,
        browser: [
            { width: 1200, height: 800, name: 'chrome' },
            { width: 1200, height: 800, name: 'firefox' }
        ],
        batchName,
    });
});

Cypress.Commands.add('eyesCheckCustom', (tag = 'Main Page') => {
    cy.eyesCheckWindow({
        tag,
        target: 'window',
        fully: true,
    });
});

Cypress.Commands.add('eyesCloseCustom', () => {
    cy.eyesClose();
});
