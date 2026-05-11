import { test, expect } from '@playwright/test';

test.describe('repD E2E Tests', () => {
  
  test('Landing page loads and displays core elements', async ({ page }) => {
    // Navigate to the base URL
    await page.goto('/');

    // Check if the title is correct
    await expect(page).toHaveTitle(/repD/i);

    // Check if the hero heading exists
    const heroHeading = page.locator('h1').first();
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toContainText('Log, track, and grow');

    // Check if the "Sign In" button is in the navbar
    const signInButton = page.getByRole('button', { name: /Sign In/i });
    await expect(signInButton).toBeVisible();
  });

  test('Login dialog opens when Get Started is clicked', async ({ page }) => {
    await page.goto('/');

    // Click the main CTA button
    const getStartedBtn = page.getByRole('button', { name: /Get Started/i }).first();
    await getStartedBtn.click();

    // Check if the dialog opens
    const dialogTitle = page.getByRole('heading', { name: /Welcome to repD/i });
    await expect(dialogTitle).toBeVisible();

    // Check if the Google login button exists inside the dialog
    const googleBtn = page.getByRole('button', { name: /Continue with Google/i });
    await expect(googleBtn).toBeVisible();
  });

});
