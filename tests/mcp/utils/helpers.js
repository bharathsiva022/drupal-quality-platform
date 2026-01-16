// utils/helpers.js - Utility Helper Functions
import fs from "fs";
import path from "path";
import { ALLOWED_PATHS, PATHS } from "../server.js";

const MIME_TYPES = {
  '.json': 'application/json',
  '.html': 'text/html',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.log': 'text/plain',
  '.md': 'text/markdown',
  '.yml': 'text/yaml',
  '.yaml': 'text/yaml',
  '.js': 'application/javascript',
  '.ts': 'application/typescript'
};

// ============================================================================
// PATH VALIDATION
// ============================================================================

export function assertAllowedPath(targetPath) {
  const resolved = path.resolve(targetPath);
  const allowed = ALLOWED_PATHS.some(base => resolved.startsWith(base));
  
  if (!allowed) {
    throw new Error(`Access denied: ${resolved}`);
  }
  
  return resolved;
}

// ============================================================================
// URI RESOLUTION
// ============================================================================

export function resolveQaUri(uri) {
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
  
  // qa://playwright/tests/example.spec.js
  if (url.host === "playwright" && parts[0] === "tests") {
    return path.join(PATHS.playwrightTests, ...parts.slice(1));
  }
  
  // qa://drupal/config/system.site
  if (url.host === "drupal" && parts[0] === "config") {
    return path.join(PATHS.drupalConfig, `${parts[1]}.yml`);
  }
  
  throw new Error(`Unknown qa:// URI: ${uri}`);
}

// ============================================================================
// FILE UTILITIES
// ============================================================================

export function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

export function listDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  return fs.readdirSync(dirPath).filter(f => !f.startsWith("."));
}