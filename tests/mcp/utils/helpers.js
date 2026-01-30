// utils/helpers.js - Helper Functions with Fixed URI Resolution
import fs from "fs";
import path from "path";
import { PATHS } from "../server.js";

// ============================================================================
// RESOLVE QA URI - FIXED VERSION
// ============================================================================

/**
 * Resolves a qa:// URI to an actual file path
 * @param {string} uri - The qa:// URI to resolve
 * @returns {string} - The resolved file path
 * 
 * Supported URI formats:
 * - qa://cypress/reports/results.json -> PATHS.cypress/results.json
 * - qa://cypress/reports/lighthouse -> PATHS.cypress/lighthouse
 * - qa://playwright-results/results.json -> PATHS.playwrightResults/results.json
 * - qa://playwright-html/index.html -> PATHS.playwrightHtml/index.html
 * - qa://drupal/... -> PATHS.drupalConfig/...
 */
export function resolveQaUri(uri) {
  if (!uri || !uri.startsWith("qa://")) {
    throw new Error(`Invalid qa:// URI: ${uri}`);
  }
  
  // Remove the qa:// prefix
  const withoutProtocol = uri.replace(/^qa:\/\//, "");
  
  // Split into category and path
  const parts = withoutProtocol.split("/");
  const category = parts[0];
  const relativePath = parts.slice(1).join("/");
  
  // Map categories to their base paths
  const categoryMap = {
    "cypress": PATHS.cypress,
    "playwright-results": PATHS.playwrightResults,
    "playwright-html": PATHS.playwrightHtml,
    "drupal": PATHS.drupalConfig
  };
  
  const basePath = categoryMap[category];
  
  if (!basePath) {
    throw new Error(`Unknown qa:// URI category: ${category}. Supported: ${Object.keys(categoryMap).join(", ")}`);
  }
  
  // Build the full path
  let resolvedPath = relativePath ? path.join(basePath, relativePath) : basePath;
  
  return resolvedPath;
}

// ============================================================================
// ASSERT ALLOWED PATH
// ============================================================================

/**
 * Ensures a resolved path is within allowed directories
 * Prevents path traversal attacks
 */
export function assertAllowedPath(filePath) {
  const allowedPaths = [
    PATHS.cypress,
    PATHS.playwrightResults,
    PATHS.playwrightHtml,
    PATHS.drupalConfig
  ];
  
  const normalizedPath = path.normalize(filePath);
  
  // Check if the path starts with any allowed path
  const isAllowed = allowedPaths.some(allowedPath => {
    const normalizedAllowed = path.normalize(allowedPath);
    return normalizedPath.startsWith(normalizedAllowed);
  });
  
  if (!isAllowed) {
    throw new Error(`Path not allowed: ${filePath}`);
  }
  
  return normalizedPath;
}

// ============================================================================
// LIST DIRECTORY
// ============================================================================

/**
 * Lists files and directories in a given path
 */
export function listDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    return entries.map(entry => {
      if (entry.isDirectory()) {
        return entry.name;
      }
      return entry.name;
    });
  } catch (error) {
    console.error(`[ListDirectory] Error reading ${dirPath}:`, error.message);
    return [];
  }
}

// ============================================================================
// GET MIME TYPE
// ============================================================================

/**
 * Returns MIME type based on file extension
 */
export function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  const mimeTypes = {
    ".json": "application/json",
    ".html": "text/html",
    ".yml": "text/yaml",
    ".yaml": "text/yaml",
    ".txt": "text/plain",
    ".xml": "application/xml",
    ".js": "application/javascript",
    ".css": "text/css",
    ".md": "text/markdown"
  };
  
  return mimeTypes[ext] || "application/octet-stream";
}

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
Example usage:

// Cypress reports (PATHS.cypress should point to .../tests/cypress/reports)
resolveQaUri("qa://cypress/reports/results.json") 
  -> "D:/drupal-quality-platform/tests/cypress/reports/reports/results.json"
  OR (if PATHS.cypress = .../tests/cypress) -> correct path

resolveQaUri("qa://cypress/results.json")
  -> "D:/drupal-quality-platform/tests/cypress/reports/results.json"

// Playwright results
resolveQaUri("qa://playwright-results/results.json")
  -> "D:/drupal-quality-platform/tests/playwright/test-results/results.json"

// Playwright HTML reports
resolveQaUri("qa://playwright-html/index.html")
  -> "D:/drupal-quality-platform/tests/playwright/html-reports/index.html"

// Drupal config
resolveQaUri("qa://drupal/user.role.editor.yml")
  -> "D:/drupal-quality-platform/config/sync/user.role.editor.yml"
*/