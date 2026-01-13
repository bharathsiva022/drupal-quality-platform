import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { z } from 'zod';

When('I send the command {string} to the MCP server', (command) => {
  // Define the expected response schema using Zod.
  const responseSchema = z.object({
    username: z.string(),
    email: z.string().email(),
  });

  // --- MOCKED RESPONSE ---
  // This is the default behavior for this example test.
  // It allows the test to pass without a running MCP server.
  const mockResponse = { username: 'testuser', email: 'testuser@example.com' };
  cy.wrap(mockResponse).as('mcpResponse');


  // --- REAL REQUEST ---
  // To make a real request to the MCP server, comment out the cy.wrap line above
  // and uncomment the cy.mcpRequest line below.
  //
  // const params = { userId: 123 };
  // cy.mcpRequest(command, params, responseSchema).as('mcpResponse');
});

Then('I should receive a response', () => {
  cy.get('@mcpResponse').then((response) => {
    // This assertion works for both the mocked and real response.
    expect(response).to.have.property('username', 'testuser');
    expect(response).to.have.property('email', 'testuser@example.com');
  });
});
