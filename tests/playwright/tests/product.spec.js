import { test, expect } from '@playwright/test';

/**
 * Product Content Type Tests
 * Generated from Drupal configuration
 * Workflow: commerce_flow
 */

test.describe('Product Content Type', () => {
  
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

  test('should create Product with required fields', async ({ page }) => {
    await page.goto('/node/add/product');
    
    const timestamp = Date.now();
    
    // Fill required fields
    await page.fill('[name="title[0][value]"]', `Test title ${timestamp}`);
    
    // Save
    await page.click('#edit-submit');
    
    // Verify success
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

  // ========================================================================
  // EDIT TESTS
  // ========================================================================

  test('should edit existing Product', async ({ page }) => {
    // Create content first
    await page.goto('/node/add/product');
    const timestamp = Date.now();
    await page.fill('[name="title[0][value]"]', `Test title ${timestamp}`);
    await page.click('#edit-submit');
    
    // Get node ID and edit
    const url = page.url();
    const nodeId = url.match(/\/node\/(\d+)/)?.[1];
    
    if (nodeId) {
      await page.goto(`/node/${nodeId}/edit`);
      await page.fill('[name="title[0][value]"]', `Updated Product ${timestamp}`);
      await page.click('#edit-submit');
      
      await expect(page.locator('.messages--status')).toContainText('updated');
    }
  });

  // ========================================================================
  // DELETE TESTS
  // ========================================================================

  test('should delete Product', async ({ page }) => {
    // Create content
    await page.goto('/node/add/product');
    const timestamp = Date.now();
    await page.fill('[name="title[0][value]"]', `Test title ${timestamp}`);
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
  // WORKFLOW TESTS (commerce_flow)
  // ========================================================================

  test('should create in draft state', async ({ page }) => {
    await page.goto('/node/add/product');
    
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
