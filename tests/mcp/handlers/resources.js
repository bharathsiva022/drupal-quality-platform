// handlers/resources.js - MCP Resources Handler
import fs from "fs";
import { PATHS } from "../server.js";
import { assertAllowedPath, resolveQaUri, getMimeType } from "../utils/helpers.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ============================================================================
// LIST RESOURCES
// ============================================================================

export async function handleListResources() {
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
}

// ============================================================================
// READ RESOURCE
// ============================================================================

export async function handleReadResource(request) {
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
}