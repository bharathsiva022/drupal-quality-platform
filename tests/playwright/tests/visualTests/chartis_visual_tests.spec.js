import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';
import pagesData from '../../fixtures/visualRegression/chartis_pages.json' assert { type: 'json' };
import { getContextOptions } from '../../utils/contextOptions.js';
import { drupalLogin } from '../../utils/drupalLogin.js'; 

test.describe('chartis – Multi-arch visual tests', () => {

  for (const pageData of Object.values(pagesData)) {

    test(`Visual – ${pageData.testName}`, async ({ browser }) => {
  const context = await browser.newContext(getContextOptions());
  const page = await context.newPage();

  if (pageData.auth) {
    await drupalLogin(page);
  }

  await page.goto(pageData.url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  await percySnapshot(page, pageData.testName, {
    widths: pageData.widths?.length ? pageData.widths : [357, 768, 1440],
    minHeight: 900,
    percyCSS: `
      #CybotCookiebotDialog { display: none !important; }
      #sliding-popup { display: none !important; }
    `
  });

  await context.close();
});
  }
});
