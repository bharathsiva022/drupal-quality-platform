// handlers/tools.js - MCP Tools Handler
import { PATHS } from "../server.js";
import { 
  listQAResources, 
  triageTestFailures, 
  summarizeTestRun,
  analyzeDrupalConfigRisk,
  readQAResource 
} from "../tools/qa-tools.js";
import { 
  analyzeDrupalProject,
  generatePlaywrightTests,
  savePlaywrightTest 
} from "../tools/drupal-tools.js";

// ============================================================================
// LIST TOOLS
// ============================================================================

export async function handleListTools() {
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
              description: "qa:// URI of the test report"
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
              description: "qa:// URI of the resource to read"
            }
          },
          required: ["resourceUri"]
        }
      },
      {
        name: "analyze_drupal_project",
        description: "Analyze Drupal project structure (content types, roles, views)",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "generate_playwright_tests",
        description: "Generate Playwright test files based on Drupal project analysis",
        inputSchema: {
          type: "object",
          properties: {
            testType: {
              type: "string",
              enum: ["content-types", "roles", "full-suite", "specific"],
              description: "Type of tests to generate"
            },
            targetName: {
              type: "string",
              description: "Specific content type or role name (for 'specific' type)"
            }
          },
          required: ["testType"]
        }
      },
      {
        name: "save_playwright_test",
        description: "Save generated Playwright test to file",
        inputSchema: {
          type: "object",
          properties: {
            filename: {
              type: "string",
              description: "Test file name (e.g., 'article.spec.js')"
            },
            content: {
              type: "string",
              description: "Test file content"
            }
          },
          required: ["filename", "content"]
        }
      }
    ]
  };
}

// ============================================================================
// CALL TOOL
// ============================================================================

export async function handleCallTool(request) {
  const { name, arguments: args } = request.params;
  
  console.error(`[Tool] Executing: ${name}`);
  
  try {
    switch (name) {
      case "list_qa_resources":
        return await listQAResources(args);
      
      case "triage_test_failures":
        return await triageTestFailures(args);
      
      case "summarize_test_run":
        return await summarizeTestRun(args);
      
      case "analyze_drupal_config_risk":
        return await analyzeDrupalConfigRisk(args);
      
      case "read_qa_resource":
        return await readQAResource(args);
      
      case "analyze_drupal_project":
        return await analyzeDrupalProject(args);
      
      case "generate_playwright_tests":
        return await generatePlaywrightTests(args);
      
      case "save_playwright_test":
        return await savePlaywrightTest(args);
      
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
}