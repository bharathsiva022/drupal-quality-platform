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

// ============================================================================
// IMPROVED SUMMARIZE TEST RUN
// ============================================================================

export async function summarizeTestRun(args) {
  const { cypressReportUri, playwrightReportUri } = args;
  
  /**
   * Parse Cypress JSON report structure
   * Cypress reports typically have a structure like:
   * { results: [{ suites: [{ tests: [{ state: "passed"|"failed", ... }] }] }] }
   */
  const parseCypressReport = (uri) => {
    try {
      const filePath = assertAllowedPath(resolveQaUri(uri));
      
      if (!fs.existsSync(filePath)) {
        return { failures: 0, passes: 0, total: 0, error: 'File not found' };
      }
      
      const content = fs.readFileSync(filePath, "utf-8");
      const report = JSON.parse(content);
      
      let failures = 0;
      let passes = 0;
      let pending = 0;
      let total = 0;
      
      // Handle different Cypress report structures
      if (report.results && Array.isArray(report.results)) {
        // Mochawesome format
        report.results.forEach(result => {
          if (result.suites && Array.isArray(result.suites)) {
            result.suites.forEach(suite => {
              if (suite.tests && Array.isArray(suite.tests)) {
                suite.tests.forEach(test => {
                  total++;
                  if (test.state === 'failed' || test.fail) {
                    failures++;
                  } else if (test.state === 'passed' || test.pass) {
                    passes++;
                  } else if (test.state === 'pending' || test.pending) {
                    pending++;
                  }
                });
              }
            });
          }
        });
      } else if (report.stats) {
        // Standard Mocha/Cypress stats format
        failures = report.stats.failures || 0;
        passes = report.stats.passes || 0;
        pending = report.stats.pending || 0;
        total = report.stats.tests || 0;
      } else if (report.tests && Array.isArray(report.tests)) {
        // Direct tests array format
        report.tests.forEach(test => {
          total++;
          if (test.state === 'failed' || test.fail) {
            failures++;
          } else if (test.state === 'passed' || test.pass) {
            passes++;
          } else if (test.state === 'pending' || test.pending) {
            pending++;
          }
        });
      }
      
      return { failures, passes, pending, total, error: null };
    } catch (error) {
      console.error(`[Cypress Parse] Error reading ${uri}:`, error.message);
      return { failures: 0, passes: 0, total: 0, error: error.message };
    }
  };
  
  /**
   * Parse Playwright JSON report structure
   * Playwright reports typically have:
   * { suites: [{ suites: [], specs: [{ tests: [{ results: [{ status: "passed"|"failed"|... }] }] }] }] }
   */
  const parsePlaywrightReport = (uri) => {
    try {
      const filePath = assertAllowedPath(resolveQaUri(uri));
      
      if (!fs.existsSync(filePath)) {
        return { failures: 0, passes: 0, total: 0, error: 'File not found' };
      }
      
      const content = fs.readFileSync(filePath, "utf-8");
      const report = JSON.parse(content);
      
      let failures = 0;
      let passes = 0;
      let skipped = 0;
      let flaky = 0;
      let total = 0;
      
      // Recursive function to traverse Playwright suite structure
      const traverseSuites = (suites) => {
        if (!Array.isArray(suites)) return;
        
        suites.forEach(suite => {
          // Process specs in this suite
          if (suite.specs && Array.isArray(suite.specs)) {
            suite.specs.forEach(spec => {
              if (spec.tests && Array.isArray(spec.tests)) {
                spec.tests.forEach(test => {
                  if (test.results && Array.isArray(test.results)) {
                    test.results.forEach(result => {
                      total++;
                      const status = result.status;
                      
                      if (status === 'passed') {
                        passes++;
                      } else if (status === 'failed') {
                        failures++;
                      } else if (status === 'skipped') {
                        skipped++;
                      } else if (status === 'timedOut') {
                        failures++;
                      } else if (status === 'interrupted') {
                        skipped++;
                      }
                    });
                  }
                  
                  // Check if test is flaky
                  if (test.results && test.results.length > 1) {
                    const hasFailure = test.results.some(r => r.status === 'failed');
                    const hasPass = test.results.some(r => r.status === 'passed');
                    if (hasFailure && hasPass) {
                      flaky++;
                    }
                  }
                });
              }
            });
          }
          
          // Recursively process nested suites
          if (suite.suites && Array.isArray(suite.suites)) {
            traverseSuites(suite.suites);
          }
        });
      };
      
      // Start traversal
      if (report.suites && Array.isArray(report.suites)) {
        traverseSuites(report.suites);
      } else if (report.stats) {
        // Alternative format with stats
        failures = report.stats.unexpected || report.stats.failed || 0;
        passes = report.stats.expected || report.stats.passed || 0;
        skipped = report.stats.skipped || 0;
        flaky = report.stats.flaky || 0;
        total = (report.stats.expected || 0) + (report.stats.unexpected || 0) + (report.stats.skipped || 0);
      }
      
      return { failures, passes, skipped, flaky, total, error: null };
    } catch (error) {
      console.error(`[Playwright Parse] Error reading ${uri}:`, error.message);
      return { failures: 0, passes: 0, total: 0, error: error.message };
    }
  };
  
  // Parse both reports
  const cypressResult = parseCypressReport(cypressReportUri);
  const playwrightResult = parsePlaywrightReport(playwrightReportUri);
  
  const totalFailures = cypressResult.failures + playwrightResult.failures;
  const totalPasses = cypressResult.passes + playwrightResult.passes;
  const totalTests = cypressResult.total + playwrightResult.total;
  
  // Build detailed summary
  const summary = {
    cypress: {
      failures: cypressResult.failures,
      passes: cypressResult.passes,
      pending: cypressResult.pending || 0,
      total: cypressResult.total,
      error: cypressResult.error
    },
    playwright: {
      failures: playwrightResult.failures,
      passes: playwrightResult.passes,
      skipped: playwrightResult.skipped || 0,
      flaky: playwrightResult.flaky || 0,
      total: playwrightResult.total,
      error: playwrightResult.error
    },
    overall: {
      totalFailures,
      totalPasses,
      totalTests,
      passRate: totalTests > 0 ? ((totalPasses / totalTests) * 100).toFixed(2) + '%' : 'N/A'
    }
  };
  
  // Determine status
  let status = 'PASS';
  let recommendation = '✅ All tests passed - release looks safe';
  
  if (totalFailures > 0) {
    status = 'FAIL';
    recommendation = `⚠️ ${totalFailures} test(s) failed - review failures before release`;
  } else if (playwrightResult.flaky > 0) {
    status = 'WARNING';
    recommendation = `⚠️ ${playwrightResult.flaky} flaky test(s) detected - monitor stability`;
  }
  
  if (cypressResult.error || playwrightResult.error) {
    status = 'ERROR';
    recommendation = '🔴 Error parsing one or more reports - check report files';
  }
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        summary,
        status,
        recommendation
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