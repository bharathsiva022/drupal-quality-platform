// server.js - Complete MCP Server for QA Testing Platform
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURATION
// ============================================================================

const PATHS = {
  cypress: path.join(__dirname, "..", "cypress", "reports"),
  playwrightResults: path.join(__dirname, "..", "playwright", "test-results"),
  playwrightHtml: path.join(__dirname, "..", "playwright", "html-reports"),
  drupalConfig: path.join(__dirname, "..", "..", "config", "sync")
};

const ALLOWED_PATHS = Object.values(PATHS).map(p => path.resolve(p));

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const MIME_TYPES = {
  '.json': 'application/json',
  '.html': 'text/html',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.log': 'text/plain',
  '.md': 'text/markdown',
  '.yml': 'text/yaml'
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function assertAllowedPath(targetPath) {
  const resolved = path.resolve(targetPath);
  const allowed = ALLOWED_PATHS.some(base => resolved.startsWith(base));
  
  if (!allowed) {
    throw new Error(`Access denied: ${resolved}`);
  }
  
  return resolved;
}

function resolveQaUri(uri) {
  const url = new URL(uri);
  
  if (url.protocol !== "qa:") {
    throw new Error(`Unsupported protocol: ${url.protocol}`);
  }
  
  const parts = url.pathname.split("/").filter(Boolean);
  
  // qa://cypress/reports/results.json
  if (url.host === "cypress" && parts[0] === "reports") {
    return path.join(PATHS.cypress, ...parts.slice(1));
  }
  
  // qa://playwright/results/results.json
  if (url.host === "playwright" && parts[0] === "results") {
    return path.join(PATHS.playwrightResults, ...parts.slice(1));
  }
  
  // qa://playwright/html/index.html
  if (url.host === "playwright" && parts[0] === "html") {
    return path.join(PATHS.playwrightHtml, ...parts.slice(1));
  }
  
  // qa://drupal/config/system.site
  if (url.host === "drupal" && parts[0] === "config") {
    return path.join(PATHS.drupalConfig, `${parts[1]}.yml`);
  }
  
  throw new Error(`Unknown qa:// URI: ${uri}`);
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function listDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  return fs.readdirSync(dirPath).filter(f => !f.startsWith("."));
}

// ============================================================================
// SERVER SETUP
// ============================================================================

const server = new Server(
  {
    name: "qa-mcp-server",
    version: "1.0.0",
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
// TOOLS HANDLER
// ============================================================================

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_qa_resources",
        description: "List available QA reports or config files by category",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              enum: ["cypress", "playwright-results", "playwright-html", "drupal"],
              description: "Category of resources to list"
            }
          },
          required: ["category"]
        }
      },
      {
        name: "triage_test_failures",
        description: "Analyze a QA report and classify failures by type",
        inputSchema: {
          type: "object",
          properties: {
            reportUri: {
              type: "string",
              description: "qa:// URI of the test report (e.g., qa://cypress/reports/results.json)"
            }
          },
          required: ["reportUri"]
        }
      },
      {
        name: "summarize_test_run",
        description: "Summarize test results from Cypress and Playwright reports",
        inputSchema: {
          type: "object",
          properties: {
            cypressReportUri: {
              type: "string",
              description: "qa:// URI for Cypress report"
            },
            playwrightReportUri: {
              type: "string",
              description: "qa:// URI for Playwright report"
            }
          },
          required: ["cypressReportUri", "playwrightReportUri"]
        }
      },
      {
        name: "analyze_drupal_config_risk",
        description: "Analyze Drupal configuration for security risks",
        inputSchema: {
          type: "object",
          properties: {
            configText: {
              type: "string",
              description: "Raw Drupal config YAML content"
            }
          },
          required: ["configText"]
        }
      },
      {
        name: "read_qa_resource",
        description: "Read the content of a QA resource file",
        inputSchema: {
          type: "object",
          properties: {
            resourceUri: {
              type: "string",
              description: "qa:// URI of the resource to read (e.g., qa://drupal/config/security)"
            }
          },
          required: ["resourceUri"]
        }
      }
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  console.error(`[Tool] Executing: ${name}`);
  
  try {
    switch (name) {
      // ======================================================================
      // LIST QA RESOURCES
      // ======================================================================
      case "list_qa_resources": {
        const { category } = args;
        
        const dirMap = {
          "cypress": PATHS.cypress,
          "playwright-results": PATHS.playwrightResults,
          "playwright-html": PATHS.playwrightHtml,
          "drupal": PATHS.drupalConfig
        };
        
        const dir = dirMap[category];
        
        if (!dir) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({ error: `Unknown category: ${category}` }, null, 2)
            }]
          };
        }
        
        const files = listDirectory(dir);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              category,
              path: dir,
              count: files.length,
              files
            }, null, 2)
          }]
        };
      }
      
      // ======================================================================
      // TRIAGE TEST FAILURES
      // ======================================================================
      case "triage_test_failures": {
        const { reportUri } = args;
        
        if (!reportUri) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({ error: "reportUri is required" }, null, 2)
            }]
          };
        }
        
        const filePath = assertAllowedPath(resolveQaUri(reportUri));
        
        if (!fs.existsSync(filePath)) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                error: `Report not found: ${reportUri}`,
                expectedPath: filePath
              }, null, 2)
            }]
          };
        }
        
        const stats = fs.statSync(filePath);
        if (stats.size > MAX_FILE_SIZE) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                error: `File too large: ${(stats.size / 1024 / 1024).toFixed(2)}MB`
              }, null, 2)
            }]
          };
        }
        
        const text = fs.readFileSync(filePath, "utf-8").toLowerCase();
        
        let category, confidence;
        
        if (text.includes("timeout")) {
          category = "timing / async";
          confidence = "high";
        } else if (text.includes("403") || text.includes("permission")) {
          category = "permission / role";
          confidence = "high";
        } else if (text.includes("element not found")) {
          category = "ui / selector";
          confidence = "medium";
        } else {
          category = "unknown";
          confidence = "low";
        }
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              reportUri,
              category,
              confidence,
              filePath
            }, null, 2)
          }]
        };
      }
      
      // ======================================================================
      // SUMMARIZE TEST RUN
      // ======================================================================
      case "summarize_test_run": {
        const { cypressReportUri, playwrightReportUri } = args;
        
        const countFailures = (uri) => {
          try {
            const filePath = assertAllowedPath(resolveQaUri(uri));
            
            if (!fs.existsSync(filePath)) {
              return 0;
            }
            
            const text = fs.readFileSync(filePath, "utf-8").toLowerCase();
            return (text.match(/failed|error|timeout|403/g) || []).length;
          } catch (error) {
            console.error(`[Summary] Error reading ${uri}:`, error.message);
            return 0;
          }
        };
        
        const cypressFailures = countFailures(cypressReportUri);
        const playwrightFailures = countFailures(playwrightReportUri);
        const totalFailures = cypressFailures + playwrightFailures;
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              summary: {
                cypressFailures,
                playwrightFailures,
                totalFailures
              },
              status: totalFailures === 0 ? "PASS" : "FAIL",
              recommendation: totalFailures === 0 
                ? "✅ Release looks safe - no failures detected"
                : "⚠️ Review failures before release"
            }, null, 2)
          }]
        };
      }
      
      // ======================================================================
      // READ QA RESOURCE
      // ======================================================================
      case "read_qa_resource": {
        const { resourceUri } = args;
        
        if (!resourceUri) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({ error: "resourceUri is required" }, null, 2)
            }]
          };
        }
        
        const filePath = assertAllowedPath(resolveQaUri(resourceUri));
        
        if (!fs.existsSync(filePath)) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                error: `Resource not found: ${resourceUri}`,
                expectedPath: filePath
              }, null, 2)
            }]
          };
        }
        
        const stats = fs.statSync(filePath);
        
        if (stats.size > MAX_FILE_SIZE) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({
                error: `File too large: ${(stats.size / 1024 / 1024).toFixed(2)}MB (max: 10MB)`
              }, null, 2)
            }]
          };
        }
        
        const content = fs.readFileSync(filePath, "utf-8");
        const mimeType = getMimeType(filePath);
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              resourceUri,
              filePath,
              mimeType,
              size: stats.size,
              content
            }, null, 2)
          }]
        };
      }
      
      // ======================================================================
      // ANALYZE DRUPAL CONFIG RISK
      // ======================================================================
      case "analyze_drupal_config_risk": {
        const { configText } = args;
        
        if (!configText) {
          return {
            content: [{
              type: "text",
              text: JSON.stringify({ error: "configText is required" }, null, 2)
            }]
          };
        }
        
        const risks = [];
        
        if (configText.includes("anonymous")) {
          risks.push("⚠️ Anonymous access enabled");
        }
        
        if (configText.includes("publish")) {
          risks.push("⚠️ Content publish permission detected");
        }
        
        if (configText.includes("administer")) {
          risks.push("🔴 Admin permissions found");
        }
        
        return {
          content: [{
            type: "text",
            text: JSON.stringify({
              risks,
              riskCount: risks.length,
              severity: risks.length === 0 ? "low" : risks.length <= 2 ? "medium" : "high",
              recommendation: risks.length === 0 
                ? "✅ No obvious security risks detected"
                : "⚠️ Review permissions and access controls"
            }, null, 2)
          }]
        };
      }
      
      default:
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ error: `Unknown tool: ${name}` }, null, 2)
          }],
          isError: true
        };
    }
  } catch (error) {
    console.error(`[Tool] Error in ${name}:`, error.message);
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ error: error.message }, null, 2)
      }],
      isError: true
    };
  }
});

// ============================================================================
// RESOURCES HANDLER
// ============================================================================

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "qa://cypress/reports/{file}",
        name: "Cypress Test Reports",
        description: "Access Cypress test execution reports",
        mimeType: "application/json"
      },
      {
        uri: "qa://playwright/results/{file}",
        name: "Playwright Test Results",
        description: "Access Playwright test results",
        mimeType: "application/json"
      },
      {
        uri: "qa://playwright/html/{file}",
        name: "Playwright HTML Reports",
        description: "Access Playwright HTML reports",
        mimeType: "text/html"
      },
      {
        uri: "qa://drupal/config/{name}",
        name: "Drupal Configuration",
        description: "Access Drupal configuration YAML files",
        mimeType: "text/yaml"
      }
    ]
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;
  
  console.error(`[Resource] Reading: ${uri}`);
  
  try {
    const filePath = assertAllowedPath(resolveQaUri(uri));
    
    if (!fs.existsSync(filePath)) {
      return {
        contents: [{
          uri,
          mimeType: "text/plain",
          text: `Resource not found: ${uri}`
        }]
      };
    }
    
    const stats = fs.statSync(filePath);
    
    if (stats.size > MAX_FILE_SIZE) {
      return {
        contents: [{
          uri,
          mimeType: "text/plain",
          text: `File too large: ${(stats.size / 1024 / 1024).toFixed(2)}MB (max: 10MB)`
        }]
      };
    }
    
    const content = fs.readFileSync(filePath, "utf-8");
    const mimeType = getMimeType(filePath);
    
    return {
      contents: [{
        uri,
        mimeType,
        text: content
      }]
    };
  } catch (error) {
    console.error(`[Resource] Error reading ${uri}:`, error.message);
    return {
      contents: [{
        uri,
        mimeType: "text/plain",
        text: `Error: ${error.message}`
      }]
    };
  }
});

// ============================================================================
// START SERVER
// ============================================================================

const transport = new StdioServerTransport();
await server.connect(transport);

console.error("✅ QA MCP Server running");
console.error(`   Cypress: ${PATHS.cypress}`);
console.error(`   Playwright: ${PATHS.playwrightResults}`);
console.error(`   Drupal: ${PATHS.drupalConfig}`);