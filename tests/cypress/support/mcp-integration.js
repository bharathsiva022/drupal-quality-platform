/**
 * @file
 * This file contains the setup for MCP (Model Context Protocol) server integration using the official SDK.
 */
const { createMcpClient } = require('@modelcontextprotocol/sdk');
const { z } = require('zod');

// Create an MCP client instance.
// The URL should point to your running MCP server.
const mcpClient = createMcpClient({
  url: 'http://localhost:8080/mcp',
  // You can add other client options here, such as custom headers.
});

/**
 * Custom Cypress command to send a command to the MCP server.
 *
 * @param {string} command - The command to send to the MCP server.
 * @param {object} params - The parameters for the command.
 * @param {z.ZodType} responseSchema - A Zod schema to validate the server's response.
 *
 * @example
 * const schema = z.object({
 *   username: z.string(),
 *   email: z.string(),
 * });
 * cy.mcpRequest('getTestUserData', { userId: 123 }, schema)
 *   .then(response => {
 *     // response is now validated and typed
 *   });
 */
Cypress.Commands.add('mcpRequest', (command, params, responseSchema) => {
  return cy.wrap(mcpClient.rpc(command, params, responseSchema));
});
