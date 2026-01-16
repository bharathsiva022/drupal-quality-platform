import { test, expect } from '@playwright/test';

/**
 * Article Content Type Tests
 * Generated from Drupal configuration
 * Workflow: editorial
 */

test.describe('Article Content Type', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login as editor
    await page.goto('/user/login');
    await page.fill('#edit-name', 'editor');
    await page.fill('#edit-pass', 'password');
    await page.click('#edit-submit');
    await expect(page).not.toHaveURL(/.*\/user\/login/);
  });

  // ========================================================================
  // CREATE TESTS
  // ========================================================================

  test('should create Article with required fields', async ({ page }) => {
    await page.goto('/node/add/article');
    
    const timestamp = Date.now();
    
    // Fill required fields
    await page.fill('[name="title[0][value]"]', `Test title ${timestamp}`);
    await page.fill('[name="body[0][value]"]', `Test body content ${timestamp}`);
    
    // Save
    await page.click('#edit-submit');
    
    // Verify success
    await expect(page.locator('.messages--status')).toContainText('created');
  });


  test('should create with hero_image', async ({ page }) => {
    await page.goto('/node/add/' + 'hero');
    const timestamp = Date.now();
    
    await page.fill('[name="title[0][value]"]', `Content with hero_image ${timestamp}`);
    
    const fileInput = page.locator('input[name="files[hero_image_0]"]');
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles('tests/fixtures/test-image.jpg');
    }
    
    await page.click('#edit-submit');
    await expect(page.locator('.messages--status')).toContainText('created');
  });

  // ========================================================================
  // VALIDATION TESTS
  // ========================================================================


  test('should validate required title field', async ({ page }) => {
    await page.goto('/node/add/' + 'title');
    
    // Skip title
    await page.click('#edit-submit');
    
    await expect(page.locator('.messages--error')).toBeVisible();
  });

  test('should validate required body field', async ({ page }) => {
    await page.goto('/node/add/' + 'body');
    
    // Skip body
    await page.click('#edit-submit');
    
    await expect(page.locator('.messages--error')).toBeVisible();
  });

  // ========================================================================
  // EDIT TESTS
  // ========================================================================

  test('should edit existing Article', async ({ page }) => {
    // Create content first
    await page.goto('/node/add/article');
    const timestamp = Date.now();
    await page.fill('[name="title[0][value]"]', `Test title ${timestamp}`);
    await page.fill('[name="body[0][value]"]', `Test body content ${timestamp}`);
    await page.click('#edit-submit');
    
    // Get node ID and edit
    const url = page.url();
    const nodeId = url.match(/\/node\/(\d+)/)?.[1];
    
    if (nodeId) {
      await page.goto(`/node/${nodeId}/edit`);
      await page.fill('[name="title[0][value]"]', `Updated Article ${timestamp}`);
      await page.click('#edit-submit');
      
      await expect(page.locator('.messages--status')).toContainText('updated');
    }
  });

  // ========================================================================
  // DELETE TESTS
  // ========================================================================

  test('should delete Article', async ({ page }) => {
    // Create content
    await page.goto('/node/add/article');
    const timestamp = Date.now();
    await page.fill('[name="title[0][value]"]', `Test title ${timestamp}`);
    await page.fill('[name="body[0][value]"]', `Test body content ${timestamp}`);
    await page.click('#edit-submit');
    
    const url = page.url();
    const nodeId = url.match(/\/node\/(\d+)/)?.[1];
    
    if (nodeId) {
      await page.goto(`/node/${nodeId}/delete`);
      await page.click('#edit-submit');
      
      await expect(page.locator('.messages--status')).toContainText('deleted');
    }
  });


  // ========================================================================
  // WORKFLOW TESTS (editorial)
  // ========================================================================

  test('should create in draft state', async ({ page }) => {
    await page.goto('/node/add/article');
    
    const timestamp = Date.now();
    await page.fill('[name="title[0][value]"]', `Draft Content ${timestamp}`);
    
    const workflowSelect = page.locator('select[name="moderation_state[0][state]"]');
    if (await workflowSelect.isVisible()) {
      await workflowSelect.selectOption('draft');
    }
    
    await page.click('#edit-submit');
    await expect(page.locator('.messages--status')).toContainText('created');
  });
});
