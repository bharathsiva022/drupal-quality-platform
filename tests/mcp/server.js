import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { drupalConfigResource } from "./resources/drupalConfig.js";
import { testReportsResource } from "./resources/testReports.js";
import { analyzeFailuresTool } from "./tools/analyzeFailures.js";

const server = new McpServer({
  name: "drupal-qa-mcp",
  version: "1.0.0"
});

/* -----------------------------
 * Resources (FIXED)
 * ----------------------------- */
server.resource(
  {
    uriTemplate: "drupal://config/sync",
    name: "Drupal Config Sync"
  },
  drupalConfigResource
);

server.resource(
  {
    uriTemplate: "qa://test-reports",
    name: "QA Test Reports"
  },
  testReportsResource
);

/* -----------------------------
 * Tools
 * ----------------------------- */
server.tool(
  analyzeFailuresTool.name,
  analyzeFailuresTool
);

/* -----------------------------
 * Start MCP Server
 * ----------------------------- */
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("Drupal QA MCP Server running (McpServer)");
