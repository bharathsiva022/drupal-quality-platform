export async function drupalLogin(page) {
  await page.goto('/user/login', { waitUntil: 'domcontentloaded' });
  await page.fill('#edit-name', process.env.USERNAME);
  await page.fill('#edit-pass', process.env.PASSWORD);
  await page.click('#edit-submit');
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
}