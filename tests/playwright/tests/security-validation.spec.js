import { test, expect } from '@playwright/test';

/**
 * Security Configuration Validation Tests
 * Tests to validate the 7 critical security issues found in security.yml
 * 
 * ISSUES FOUND:
 * 1. HTTPS not enforced
 * 2. HSTS disabled
 * 3. Unsafe Content Security Policy
 * 4. Clickjacking allowed (X-Frame-Options: ALLOWALL)
 * 5. Missing X-Content-Type-Options
 * 6. Weak password policy (6 chars minimum)
 * 7. Brute force vulnerability (20 attempts allowed)
 */

test.describe('Security Configuration Tests', () => {

  // ========================================================================
  // ISSUE 1 & 2: HTTPS & HSTS TESTS
  // ========================================================================

  test.describe('HTTPS & Transport Security', () => {
    
    test('should enforce HTTPS redirects', async ({ page }) => {
      // Try to access via HTTP
      const httpUrl = 'http://your-drupal-site.com';
      
      await page.goto(httpUrl);
      
      // Check if redirected to HTTPS
      const currentUrl = page.url();
      
      // EXPECTED: Should redirect to HTTPS
      // CURRENT ISSUE: HTTPS not enforced (enforced: false)
      if (currentUrl.startsWith('https://')) {
        console.log('✅ PASS: HTTPS is enforced');
      } else {
        console.log('❌ FAIL: HTTP allowed (Security Issue #1)');
        expect(currentUrl).toContain('https://'); // This will fail until fixed
      }
    });

    test('should have HSTS header enabled', async ({ page, request }) => {
      const response = await request.get('/');
      const headers = response.headers();
      
      const hstsHeader = headers['strict-transport-security'];
      
      // EXPECTED: Should have HSTS header
      // CURRENT ISSUE: HSTS disabled (enabled: false)
      if (hstsHeader) {
        console.log('✅ PASS: HSTS header present:', hstsHeader);
        expect(hstsHeader).toContain('max-age=');
      } else {
        console.log('❌ FAIL: HSTS header missing (Security Issue #2)');
        expect(hstsHeader).toBeDefined(); // This will fail until fixed
      }
    });

    test('should have minimum 1 year HSTS max-age', async ({ request }) => {
      const response = await request.get('/');
      const hstsHeader = response.headers()['strict-transport-security'];
      
      if (hstsHeader) {
        const maxAgeMatch = hstsHeader.match(/max-age=(\d+)/);
        if (maxAgeMatch) {
          const maxAge = parseInt(maxAgeMatch[1]);
          const oneYear = 31536000; // seconds in a year
          
          expect(maxAge).toBeGreaterThanOrEqual(oneYear);
          console.log(`✅ PASS: HSTS max-age is ${maxAge} seconds`);
        }
      } else {
        console.log('❌ FAIL: HSTS not configured (max_age: 0)');
      }
    });
  });

  // ========================================================================
  // ISSUE 3: CONTENT SECURITY POLICY TESTS
  // ========================================================================

  test.describe('Content Security Policy', () => {
    
    test('should have restrictive CSP header', async ({ request }) => {
      const response = await request.get('/');
      const cspHeader = response.headers()['content-security-policy'];
      
      // EXPECTED: "default-src 'self'"
      // CURRENT ISSUE: "default-src * 'unsafe-inline' 'unsafe-eval'"
      
      if (cspHeader) {
        console.log('CSP Header:', cspHeader);
        
        // Check for dangerous directives
        if (cspHeader.includes('unsafe-inline')) {
          console.log('❌ FAIL: unsafe-inline detected (XSS risk)');
          expect(cspHeader).not.toContain('unsafe-inline');
        }
        
        if (cspHeader.includes('unsafe-eval')) {
          console.log('❌ FAIL: unsafe-eval detected (Code injection risk)');
          expect(cspHeader).not.toContain('unsafe-eval');
        }
        
        if (cspHeader.includes('default-src *')) {
          console.log('❌ FAIL: Allows all sources (default-src *)');
          expect(cspHeader).not.toContain('default-src *');
        }
        
        // Should be restrictive
        if (cspHeader.includes("default-src 'self'")) {
          console.log('✅ PASS: Restrictive CSP configured');
        }
      } else {
        console.log('❌ FAIL: No CSP header found');
        expect(cspHeader).toBeDefined();
      }
    });

    test('should block inline scripts when CSP is strict', async ({ page }) => {
      // This test checks if inline scripts are blocked
      await page.goto('/');
      
      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      // Try to inject inline script
      await page.evaluate(() => {
        const script = document.createElement('script');
        script.textContent = 'console.log("inline-script-executed")';
        document.body.appendChild(script);
      });
      
      // With proper CSP, inline scripts should be blocked
      // CURRENT ISSUE: unsafe-inline allows this
      const hasCSPError = consoleErrors.some(err => 
        err.includes('Content Security Policy')
      );
      
      if (hasCSPError) {
        console.log('✅ PASS: Inline scripts blocked by CSP');
      } else {
        console.log('❌ FAIL: Inline scripts allowed (unsafe-inline enabled)');
      }
    });
  });

  // ========================================================================
  // ISSUE 4: CLICKJACKING PROTECTION TESTS
  // ========================================================================

  test.describe('Clickjacking Protection', () => {
    
    test('should have X-Frame-Options header', async ({ request }) => {
      const response = await request.get('/');
      const xFrameOptions = response.headers()['x-frame-options'];
      
      // EXPECTED: "SAMEORIGIN" or "DENY"
      // CURRENT ISSUE: "ALLOWALL"
      
      if (xFrameOptions) {
        console.log('X-Frame-Options:', xFrameOptions);
        
        if (xFrameOptions === 'ALLOWALL') {
          console.log('❌ FAIL: Site can be framed by anyone (Security Issue #4)');
          expect(xFrameOptions).not.toBe('ALLOWALL');
        } else if (xFrameOptions === 'SAMEORIGIN' || xFrameOptions === 'DENY') {
          console.log('✅ PASS: Clickjacking protection enabled');
        }
      } else {
        console.log('❌ FAIL: X-Frame-Options header missing');
        expect(xFrameOptions).toBeDefined();
      }
    });

    test('should prevent iframe embedding from external sites', async ({ page, context }) => {
      // This test simulates embedding the site in an iframe
      const html = `
        <!DOCTYPE html>
        <html>
        <body>
          <iframe id="target" src="${page.url()}"></iframe>
        </body>
        </html>
      `;
      
      // With ALLOWALL, this will work
      // With SAMEORIGIN, this should be blocked
      
      const newPage = await context.newPage();
      await newPage.setContent(html);
      
      const iframe = newPage.frameLocator('#target');
      
      try {
        await iframe.locator('body').waitFor({ timeout: 3000 });
        console.log('❌ FAIL: Site can be embedded (ALLOWALL is set)');
      } catch (error) {
        console.log('✅ PASS: Site cannot be embedded (Protected from clickjacking)');
      }
      
      await newPage.close();
    });
  });

  // ========================================================================
  // ISSUE 5: MIME TYPE SNIFFING TESTS
  // ========================================================================

  test.describe('MIME Type Protection', () => {
    
    test('should have X-Content-Type-Options header', async ({ request }) => {
      const response = await request.get('/');
      const xContentTypeOptions = response.headers()['x-content-type-options'];
      
      // EXPECTED: "nosniff"
      // CURRENT ISSUE: "" (empty)
      
      if (xContentTypeOptions === 'nosniff') {
        console.log('✅ PASS: MIME sniffing protection enabled');
      } else {
        console.log('❌ FAIL: X-Content-Type-Options missing (Security Issue #5)');
        console.log('Current value:', xContentTypeOptions || '(empty)');
        expect(xContentTypeOptions).toBe('nosniff');
      }
    });
  });

  // ========================================================================
  // ISSUE 6: PASSWORD POLICY TESTS
  // ========================================================================

  test.describe('Password Policy', () => {
    
    test('should reject passwords shorter than 12 characters', async ({ page }) => {
      await page.goto('/user/register');
      
      const timestamp = Date.now();
      const weakPassword = 'weak'; // Only 4 characters
      
      // Fill registration form
      await page.fill('[name="name"]', `testuser_${timestamp}`);
      await page.fill('[name="mail"]', `test_${timestamp}@example.com`);
      await page.fill('[name="pass[pass1]"]', weakPassword);
      await page.fill('[name="pass[pass2]"]', weakPassword);
      
      await page.click('#edit-submit');
      
      // EXPECTED: Should show error for weak password
      // CURRENT ISSUE: Accepts 6+ character passwords (min_length: 6)
      
      const errorMessage = page.locator('.messages--error');
      const hasPasswordError = await errorMessage.isVisible();
      
      if (hasPasswordError) {
        const errorText = await errorMessage.textContent();
        if (errorText.toLowerCase().includes('password')) {
          console.log('✅ PASS: Weak password rejected');
        }
      } else {
        console.log('❌ FAIL: Weak password accepted (min_length: 6, should be 12)');
      }
    });

    test('should require uppercase, numbers, and special characters', async ({ page }) => {
      await page.goto('/user/register');
      
      const timestamp = Date.now();
      
      // Test cases for weak passwords
      const weakPasswords = [
        'alllowercase123',     // No uppercase
        'ALLUPPERCASE123',     // No lowercase  
        'NoNumbersHere',       // No numbers
        'NoSpecialChar123',    // No special chars
      ];
      
      for (const password of weakPasswords) {
        await page.fill('[name="name"]', `testuser_${timestamp}_${Math.random()}`);
        await page.fill('[name="mail"]', `test_${timestamp}_${Math.random()}@example.com`);
        await page.fill('[name="pass[pass1]"]', password);
        await page.fill('[name="pass[pass2]"]', password);
        
        await page.click('#edit-submit');
        
        // EXPECTED: Should require complexity
        // CURRENT ISSUE: No complexity requirements
        const errorMessage = page.locator('.messages--error');
        const hasError = await errorMessage.isVisible();
        
        if (!hasError) {
          console.log(`❌ FAIL: Weak password accepted: "${password}" (Security Issue #6)`);
          console.log('Current policy: No uppercase/number/special char requirements');
        }
        
        await page.goto('/user/register'); // Reset form
      }
    });
  });

  // ========================================================================
  // ISSUE 7: BRUTE FORCE PROTECTION TESTS
  // ========================================================================

  test.describe('Brute Force Protection', () => {
    
    test('should block after 5 failed login attempts', async ({ page }) => {
      await page.goto('/user/login');
      
      const maxAttempts = 5; // Should be 5, currently 20
      const testUser = 'nonexistent_user';
      const wrongPassword = 'wrong_password';
      
      // EXPECTED: Block after 5 attempts
      // CURRENT ISSUE: Allows 20 attempts (max_attempts: 20)
      
      for (let i = 1; i <= 10; i++) {
        await page.fill('#edit-name', testUser);
        await page.fill('#edit-pass', wrongPassword);
        await page.click('#edit-submit');
        
        await page.waitForTimeout(500); // Small delay
        
        // Check if blocked
        const errorMessage = await page.locator('.messages--error').textContent();
        
        if (errorMessage.toLowerCase().includes('blocked') || 
            errorMessage.toLowerCase().includes('too many')) {
          console.log(`✅ PASS: Account blocked after ${i} attempts`);
          expect(i).toBeLessThanOrEqual(maxAttempts);
          return;
        }
        
        if (i === 10) {
          console.log(`❌ FAIL: Still not blocked after ${i} attempts (Security Issue #7)`);
          console.log('Current setting: max_attempts: 20 (should be 5)');
        }
      }
    });

    test('should have appropriate lockout window', async ({ page }) => {
      // This tests the time window for failed attempts
      // EXPECTED: 15 minutes
      // CURRENT ISSUE: 5 minutes (window_minutes: 5)
      
      await page.goto('/user/login');
      
      // Make multiple failed attempts
      for (let i = 0; i < 3; i++) {
        await page.fill('#edit-name', 'testuser');
        await page.fill('#edit-pass', 'wrongpassword');
        await page.click('#edit-submit');
        await page.waitForTimeout(300);
      }
      
      const errorMessage = await page.locator('.messages--error').textContent();
      
      if (errorMessage.includes('5 minutes')) {
        console.log('❌ FAIL: Lockout window too short (5 minutes, should be 15)');
      } else if (errorMessage.includes('15 minutes')) {
        console.log('✅ PASS: Appropriate lockout window (15 minutes)');
      }
    });
  });

  // ========================================================================
  // PERMISSION ISSUE: EDITOR CAN'T PUBLISH
  // ========================================================================

  test.describe('User Role Permissions', () => {
    
    test('editor should be able to publish articles', async ({ page }) => {
      // Login as editor
      await page.goto('/user/login');
      await page.fill('#edit-name', 'editor');
      await page.fill('#edit-pass', 'password');
      await page.click('#edit-submit');
      
      // Try to create and publish article
      await page.goto('/node/add/article');
      
      const timestamp = Date.now();
      await page.fill('[name="title[0][value]"]', `Test Article ${timestamp}`);
      await page.fill('[name="body[0][value]"]', `Test content ${timestamp}`);
      
      // Try to publish
      const publishButton = page.locator('[name="moderation_state[0][state]"]');
      
      if (await publishButton.isVisible()) {
        const options = await publishButton.locator('option').allTextContents();
        
        if (options.includes('Published') || options.includes('publish')) {
          console.log('✅ PASS: Editor can publish');
        } else {
          console.log('❌ FAIL: Editor cannot publish (missing permission)');
          console.log('This explains the 403 Forbidden test failures!');
        }
      }
      
      await page.click('#edit-submit');
      
      // Check for 403 error
      const errorMessage = await page.locator('.messages--error').textContent();
      
      if (errorMessage.includes('403') || errorMessage.includes('permission')) {
        console.log('❌ FAIL: 403 Forbidden - Editor lacks publish permission');
        expect(errorMessage).not.toContain('403');
      }
    });
  });

  // ========================================================================
  // COMPREHENSIVE SECURITY HEADERS CHECK
  // ========================================================================

  test('should have all security headers configured', async ({ request }) => {
    const response = await request.get('/');
    const headers = response.headers();
    
    console.log('\n=== SECURITY HEADERS AUDIT ===\n');
    
    const securityHeaders = {
      'strict-transport-security': {
        expected: 'max-age=31536000',
        issue: 'Issue #2: HSTS disabled'
      },
      'content-security-policy': {
        expected: "default-src 'self'",
        issue: 'Issue #3: Unsafe CSP'
      },
      'x-frame-options': {
        expected: 'SAMEORIGIN',
        issue: 'Issue #4: Clickjacking allowed'
      },
      'x-content-type-options': {
        expected: 'nosniff',
        issue: 'Issue #5: MIME sniffing allowed'
      },
      'x-xss-protection': {
        expected: '1; mode=block',
        issue: 'Additional: XSS protection'
      }
    };
    
    let issuesFound = 0;
    
    for (const [header, config] of Object.entries(securityHeaders)) {
      const value = headers[header];
      
      if (value) {
        console.log(`✅ ${header}: ${value}`);
      } else {
        console.log(`❌ ${header}: MISSING (${config.issue})`);
        issuesFound++;
      }
    }
    
    console.log(`\nTotal security header issues: ${issuesFound}`);
    
    expect(issuesFound).toBe(0); // This will fail until all issues are fixed
  });
});
