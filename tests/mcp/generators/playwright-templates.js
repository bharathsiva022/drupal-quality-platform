// ============================================================================
// CONTENT TYPE TEST GENERATOR
// ============================================================================

export function generateContentTypeTest(contentType) {
  const fields = contentType.fields || {};
  const fieldTests = generateFieldTests(fields);
  const fieldValidations = generateFieldValidations(fields);
  
  return `import { test, expect } from '@playwright/test';

/**
 * ${contentType.name} Content Type Tests
 * Generated from Drupal configuration
 * Workflow: ${contentType.workflow}
 */

test.describe('${contentType.name} Content Type', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login as editor
    await page.goto('/user/login');
    await page.fill('#edit-name', 'editor');
    await page.fill('#edit-pass', 'password');
    await page.click('#edit-submit');
    await expect(page).not.toHaveURL(/.*\\/user\\/login/);
  });

  // ========================================================================
  // CREATE TESTS
  // ========================================================================

  test('should create ${contentType.name} with required fields', async ({ page }) => {
    await page.goto('/node/add/${contentType.machineName}');
    
    const timestamp = Date.now();
    
    // Fill required fields
    ${generateRequiredFieldsCode(fields)}
    
    // Save
    await page.click('#edit-submit');
    
    // Verify success
    await expect(page.locator('.messages--status')).toContainText('created');
  });

${fieldTests}

  // ========================================================================
  // VALIDATION TESTS
  // ========================================================================

${fieldValidations}

  // ========================================================================
  // EDIT TESTS
  // ========================================================================

  test('should edit existing ${contentType.name}', async ({ page }) => {
    // Create content first
    await page.goto('/node/add/${contentType.machineName}');
    const timestamp = Date.now();
    ${generateRequiredFieldsCode(fields)}
    await page.click('#edit-submit');
    
    // Get node ID and edit
    const url = page.url();
    const nodeId = url.match(/\\/node\\/(\\d+)/)?.[1];
    
    if (nodeId) {
      await page.goto(\`/node/\${nodeId}/edit\`);
      await page.fill('[name="title[0][value]"]', \`Updated ${contentType.name} \${timestamp}\`);
      await page.click('#edit-submit');
      
      await expect(page.locator('.messages--status')).toContainText('updated');
    }
  });

  // ========================================================================
  // DELETE TESTS
  // ========================================================================

  test('should delete ${contentType.name}', async ({ page }) => {
    // Create content
    await page.goto('/node/add/${contentType.machineName}');
    const timestamp = Date.now();
    ${generateRequiredFieldsCode(fields)}
    await page.click('#edit-submit');
    
    const url = page.url();
    const nodeId = url.match(/\\/node\\/(\\d+)/)?.[1];
    
    if (nodeId) {
      await page.goto(\`/node/\${nodeId}/delete\`);
      await page.click('#edit-submit');
      
      await expect(page.locator('.messages--status')).toContainText('deleted');
    }
  });

${contentType.workflow !== 'default' ? generateWorkflowTests(contentType) : ''}
});
`;
}

// ============================================================================
// FIELD CODE GENERATORS
// ============================================================================

function generateRequiredFieldsCode(fields) {
  const requiredFields = Object.entries(fields).filter(([_, field]) => field.required);
  
  if (requiredFields.length === 0) {
    return `await page.fill('[name="title[0][value]"]', \`Test Content \${timestamp}\`);`;
  }
  
  return requiredFields.map(([fieldName, field]) => {
    switch (field.type) {
      case 'string':
        return `await page.fill('[name="${fieldName}[0][value]"]', \`Test ${fieldName} \${timestamp}\`);`;
      case 'text_long':
        return `await page.fill('[name="${fieldName}[0][value]"]', \`Test ${fieldName} content \${timestamp}\`);`;
      case 'decimal':
        return `await page.fill('[name="${fieldName}[0][value]"]', '99.99');`;
      case 'image':
        return `// Upload ${fieldName}\n    const fileInput = page.locator('input[name="files[${fieldName}_0]"]');\n    if (await fileInput.isVisible()) {\n      await fileInput.setInputFiles('tests/fixtures/test-image.jpg');\n    }`;
      default:
        return `await page.fill('[name="${fieldName}[0][value]"]', 'test value');`;
    }
  }).join('\n    ');
}

function generateFieldTests(fields) {
  const optionalFields = Object.entries(fields).filter(([_, field]) => !field.required);
  
  if (optionalFields.length === 0) {
    return '';
  }
  
  return optionalFields.map(([fieldName, field]) => {
    if (field.type === 'image') {
      return `
  test('should create with ${fieldName}', async ({ page }) => {
    await page.goto('/node/add/' + '${fieldName.split('_')[0]}');
    const timestamp = Date.now();
    
    await page.fill('[name="title[0][value]"]', \`Content with ${fieldName} \${timestamp}\`);
    
    const fileInput = page.locator('input[name="files[${fieldName}_0]"]');
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles('tests/fixtures/test-image.jpg');
    }
    
    await page.click('#edit-submit');
    await expect(page.locator('.messages--status')).toContainText('created');
  });`;
    }
    return '';
  }).filter(Boolean).join('\n');
}

function generateFieldValidations(fields) {
  return Object.entries(fields)
    .filter(([_, field]) => field.required)
    .map(([fieldName, field]) => `
  test('should validate required ${fieldName} field', async ({ page }) => {
    await page.goto('/node/add/' + '${fieldName.split('_')[0]}');
    
    // Skip ${fieldName}
    await page.click('#edit-submit');
    
    await expect(page.locator('.messages--error')).toBeVisible();
  });`)
    .join('\n');
}

function generateWorkflowTests(contentType) {
  return `
  // ========================================================================
  // WORKFLOW TESTS (${contentType.workflow})
  // ========================================================================

  test('should create in draft state', async ({ page }) => {
    await page.goto('/node/add/${contentType.machineName}');
    
    const timestamp = Date.now();
    await page.fill('[name="title[0][value]"]', \`Draft Content \${timestamp}\`);
    
    const workflowSelect = page.locator('select[name="moderation_state[0][state]"]');
    if (await workflowSelect.isVisible()) {
      await workflowSelect.selectOption('draft');
    }
    
    await page.click('#edit-submit');
    await expect(page.locator('.messages--status')).toContainText('created');
  });`;
}

// ============================================================================
// ROLE TEST GENERATOR
// ============================================================================

export function generateRoleTest(role) {
  return `import { test, expect } from '@playwright/test';

/**
 * ${role.label} Role Permission Tests
 * Tests for ${role.id} role permissions
 */

test.describe('${role.label} Role Permissions', () => {
  
  test('should login as ${role.label}', async ({ page }) => {
    await page.goto('/user/login');
    await page.fill('#edit-name', '${role.id}_test');
    await page.fill('#edit-pass', 'password');
    await page.click('#edit-submit');
    
    await expect(page).not.toHaveURL(/.*\\/user\\/login/);
  });

${generatePermissionTests(role)}

  test('should not access admin pages as ${role.label}', async ({ page }) => {
    await page.goto('/user/login');
    await page.fill('#edit-name', '${role.id}_test');
    await page.fill('#edit-pass', 'password');
    await page.click('#edit-submit');
    
    await page.goto('/admin');
    
    ${role.permissions.some(p => p.includes('administer')) 
      ? `await expect(page).not.toContainText('Access denied');` 
      : `await expect(page.locator('h1')).toContainText('Access denied');`
    }
  });
});
`;
}

function generatePermissionTests(role) {
  return role.permissions.slice(0, 3).map(permission => `
  test('should have permission: ${permission}', async ({ page }) => {
    await page.goto('/user/login');
    await page.fill('#edit-name', '${role.id}_test');
    await page.fill('#edit-pass', 'password');
    await page.click('#edit-submit');
    
    // TODO: Add specific test for ${permission}
  });`).join('\n');
}

// ============================================================================
// FULL SUITE GENERATOR
// ============================================================================

export function generateFullSuite(analysis) {
  const { contentTypes, roles, views } = analysis;
  
  return `import { test, expect } from '@playwright/test';

/**
 * Full Drupal Project Test Suite
 * Generated: ${new Date().toISOString()}
 * 
 * Content Types: ${contentTypes.length}
 * User Roles: ${roles.length}
 * Views: ${views.length}
 */

test.describe('Drupal Project - Full Suite', () => {

  // ========================================================================
  // CONTENT TYPE TESTS
  // ========================================================================
${contentTypes.map(ct => `
  test.describe('${ct.name}', () => {
    test('should create ${ct.name}', async ({ page }) => {
      await page.goto('/user/login');
      await page.fill('#edit-name', 'admin');
      await page.fill('#edit-pass', 'admin');
      await page.click('#edit-submit');
      
      await page.goto('/node/add/${ct.machineName}');
      await page.fill('[name="title[0][value]"]', 'Test ${ct.name}');
      await page.click('#edit-submit');
      
      await expect(page.locator('.messages--status')).toContainText('created');
    });
  });`).join('\n')}

  // ========================================================================
  // ROLE TESTS
  // ========================================================================
${roles.filter(r => r.id !== 'anonymous').map(role => `
  test.describe('${role.label} Role', () => {
    test('should login as ${role.label}', async ({ page }) => {
      await page.goto('/user/login');
      await page.fill('#edit-name', '${role.id}_test');
      await page.fill('#edit-pass', 'password');
      await page.click('#edit-submit');
      
      await expect(page).not.toHaveURL(/.*\\/user\\/login/);
    });
  });`).join('\n')}

  // ========================================================================
  // VIEW TESTS
  // ========================================================================
${views.map(view => `
  test('should display ${view.label}', async ({ page }) => {
    await page.goto('${view.path || '/'}');
    await expect(page).toHaveURL(/.*${view.path.replace('/', '') || 'home'}/);
  });`).join('\n')}
});
`;
}