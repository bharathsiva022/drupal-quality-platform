// tools/qa-tools.js - QA Testing Tools Implementation
import fs from "fs";
import { PATHS } from "../server.js";
import { assertAllowedPath, resolveQaUri, listDirectory } from "../utils/helpers.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ============================================================================
// LIST QA RESOURCES
// ============================================================================

export async function listQAResources(args) {
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

// ============================================================================
// TRIAGE TEST FAILURES
// ============================================================================

export async function triageTestFailures(args) {
  const { reportUri } = args;
  
  if (!reportUri) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          error: "reportUri is required. Example: qa://cypress/reports/results.json"
        }, null, 2)
      }]
    };
  }
  
  try {
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
            error: `File too large: ${(stats.size / 1024 / 1024).toFixed(2)}MB (max: 10MB)`
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
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ 
          error: error.message,
          reportUri
        }, null, 2)
      }]
    };
  }
}

// ============================================================================
// SUMMARIZE TEST RUN
// ============================================================================

export async function summarizeTestRun(args) {
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

// ============================================================================
// ANALYZE DRUPAL CONFIG RISK
// ============================================================================

export async function analyzeDrupalConfigRisk(args) {
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

// ============================================================================
// READ QA RESOURCE
// ============================================================================

export async function readQAResource(args) {
  const { resourceUri } = args;
  
  if (!resourceUri) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ error: "resourceUri is required" }, null, 2)
      }]
    };
  }
  
  try {
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
    const { getMimeType } = await import("../utils/helpers.js");
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
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ 
          error: error.message,
          resourceUri
        }, null, 2)
      }]
    };
  }
}