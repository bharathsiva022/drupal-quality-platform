// server.js - Clean MCP Server Entry Point
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import path from "path";
import { fileURLToPath } from "url";

// Import handlers
import { handleListTools, handleCallTool } from "./handlers/tools.js";
import { handleListResources, handleReadResource } from "./handlers/resources.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// PATHS CONFIGURATION
// ============================================================================

export const PATHS = {
  cypress: path.join(__dirname, "..", "cypress", "reports"),
  playwrightResults: path.join(__dirname, "..", "playwright", "test-results"),
  playwrightHtml: path.join(__dirname, "..", "playwright", "html-reports"),
  playwrightTests: path.join(__dirname, "..", "playwright", "tests"),
  drupalConfig: path.join(__dirname, "..", "..", "config", "sync"),
  drupalWeb: path.join(__dirname, "..", "..", "web"),
  drupalModules: path.join(__dirname, "..", "..", "web", "modules", "custom")
};

export const ALLOWED_PATHS = Object.values(PATHS).map(p => path.resolve(p));

// ============================================================================
// SERVER SETUP
// ============================================================================

const server = new Server(
  {
    name: "qa-mcp-server",
    version: "2.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    },
  }
);

console.error("[Server] Initializing QA MCP Server...");

// ============================================================================
// REQUEST HANDLERS
// ============================================================================

server.setRequestHandler(ListToolsRequestSchema, handleListTools);
server.setRequestHandler(CallToolRequestSchema, handleCallTool);
server.setRequestHandler(ListResourcesRequestSchema, handleListResources);
server.setRequestHandler(ReadResourceRequestSchema, handleReadResource);

// ============================================================================
// START SERVER
// ============================================================================

const transport = new StdioServerTransport();
await server.connect(transport);

console.error("✅ QA MCP Server running");
console.error(`   Cypress: ${PATHS.cypress}`);
console.error(`   Playwright: ${PATHS.playwrightResults}`);
console.error(`   Drupal Config: ${PATHS.drupalConfig}`);
console.error(`   Test Generation: Enabled`);