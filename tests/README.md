# Cypress for Drupal

This package provides a setup for integrating Cypress with Drupal, including
configuration and necessary files to get started. It is designed to be installed
in the `tests` folder of your Drupal project.

## Getting Started

### Prerequisites

- Ensure that you have Node.js and npm installed on your system.
- Your Drupal project should have the `tests` folder ready to receive the
package contents.

### Installation and Usage

**Install the Package**

Install the package and place it within the `tests` folder of your project, run:

```bash
npm install cypress-for-drupal
# or
npm i
```

**Verify Installation**

After installation, the following files and folders should be present in the
`tests` folder of your project:

```
/tests
├── cypress/
├── config/
├── cypress.config.js
├── package.json
└── custom.cypress.config.js
```

**How to Use**

1. **`cypress.config.js`**: This is the default configuration file for Cypress.
Modify this file according to your project requirements.
2. **`custom.cypress.config.js`**: This file is provided as a sample
configuration to avoid accidental changes to the default configuration. Use this
file as a reference or for additional configurations.

**Running Tests**

The `package.json` file has scripts to run the tests by opening the test runner
or using the CLI: To ensure confidentiality and security of the username and
password, it is recommended to pass them securely via CLI

```bash
# Example:

1. Running tests from CLI
   - CYPRESS_username=<username> CYPRESS_password=<password>
     npm run run:test:stage

2. Running tests in the test runner
   - CYPRESS_username=<username> CYPRESS_password=<password>
     npm run open:test:stage

3. Running tests using custom config file
   - npm run run:test:with:custom:config
```

**Troubleshooting**

- **Path Issues**: Ensure that the `tests` folder exists with a package.json
- **Dependencies**: Make sure all dependencies are installed correctly by
running `npm install` in the `tests` folder.
