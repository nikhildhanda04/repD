import { test, expect } from '@playwright/test';

test.describe('Protected Routing', () => {
  
  test('Redirects unauthenticated users from /dashboard to /', async ({ page }) => {
    // Intercept the auth session check and return 401 Unauthorized
    await page.route('**/api/auth/get-session', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Unauthorized' })
      });
    });

    await page.goto('/dashboard');
    
    // Should be redirected to the landing page
    await expect(page).toHaveURL(/.*localhost:5173\/?$/);
    
    // Hero section should be visible
    const heroHeading = page.locator('h1').first();
    await expect(heroHeading).toContainText('Log, track, and grow');
  });

  test('Redirects unauthenticated users from /telegram to /', async ({ page }) => {
    await page.route('**/api/auth/get-session', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Unauthorized' })
      });
    });

    await page.goto('/telegram');
    await expect(page).toHaveURL(/.*localhost:5173\/?$/);
  });
});
