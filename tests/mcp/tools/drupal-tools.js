// tools/drupal-tools.js - Drupal Analysis & Test Generation Tools
import fs from "fs";
import path from "path";
import { PATHS } from "../server.js";
import { analyzeCustomDrupalProject } from "../generators/drupal-analyzer.js";
import { 
  generateContentTypeTest, 
  generateRoleTest, 
  generateFullSuite 
} from "../generators/playwright-templates.js";

// ============================================================================
// ANALYZE DRUPAL PROJECT
// ============================================================================

export async function analyzeDrupalProject(args) {
  try {
    const analysis = analyzeCustomDrupalProject();
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          summary: {
            contentTypes: analysis.contentTypes.length,
            roles: analysis.roles.length,
            views: analysis.views.length,
            structure: analysis.structure
          },
          contentTypes: analysis.contentTypes,
          roles: analysis.roles,
          views: analysis.views,
          configPath: analysis.configPath
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ 
          error: error.message,
          stack: error.stack
        }, null, 2)
      }]
    };
  }
}

// ============================================================================
// GENERATE PLAYWRIGHT TESTS
// ============================================================================

export async function generatePlaywrightTests(args) {
  const { testType, targetName } = args;
  
  try {
    const analysis = analyzeCustomDrupalProject();
    const { contentTypes, roles, views } = analysis;
    
    let generatedTests = {};
    
    switch (testType) {
      case 'content-types':
        contentTypes.forEach(ct => {
          generatedTests[`${ct.machineName}.spec.js`] = generateContentTypeTest(ct);
        });
        break;
        
      case 'roles':
        roles.forEach(role => {
          if (role.id !== 'anonymous' && role.id !== 'authenticated') {
            generatedTests[`${role.id}-role.spec.js`] = generateRoleTest(role);
          }
        });
        break;
        
      case 'full-suite':
        generatedTests['drupal-full-suite.spec.js'] = generateFullSuite(analysis);
        break;
        
      case 'specific':
        if (targetName) {
          const ct = contentTypes.find(c => c.machineName === targetName);
          if (ct) {
            generatedTests[`${targetName}.spec.js`] = generateContentTypeTest(ct);
          } else {
            const role = roles.find(r => r.id === targetName);
            if (role) {
              generatedTests[`${targetName}-role.spec.js`] = generateRoleTest(role);
            } else {
              return {
                content: [{
                  type: "text",
                  text: JSON.stringify({ 
                    error: `Target '${targetName}' not found in content types or roles` 
                  }, null, 2)
                }]
              };
            }
          }
        }
        break;
        
      default:
        return {
          content: [{
            type: "text",
            text: JSON.stringify({ 
              error: `Unknown test type: ${testType}` 
            }, null, 2)
          }]
        };
    }
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          testType,
          filesGenerated: Object.keys(generatedTests).length,
          files: generatedTests,
          analysis: {
            contentTypes: contentTypes.map(ct => ct.machineName),
            roles: roles.map(r => r.id)
          }
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ 
          error: error.message,
          stack: error.stack
        }, null, 2)
      }]
    };
  }
}

// ============================================================================
// SAVE PLAYWRIGHT TEST
// ============================================================================

export async function savePlaywrightTest(args) {
  const { filename, content } = args;
  
  if (!filename || !content) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ 
          error: "filename and content are required" 
        }, null, 2)
      }]
    };
  }
  
  try {
    // Ensure tests directory exists
    if (!fs.existsSync(PATHS.playwrightTests)) {
      fs.mkdirSync(PATHS.playwrightTests, { recursive: true });
    }
    
    const testPath = path.join(PATHS.playwrightTests, filename);
    fs.writeFileSync(testPath, content, 'utf-8');
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          filename,
          path: testPath,
          size: content.length
        }, null, 2)
      }]
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({ 
          error: error.message 
        }, null, 2)
      }]
    };
  }
}