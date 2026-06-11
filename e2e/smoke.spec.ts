import { test, expect } from '@playwright/test';

test('landing page loads with accessible navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/CarbonWise Coach/i);
  await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /start your climate assessment/i })).toBeVisible();
});

test('demo dashboard flow loads footprint data', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /explore the demo dashboard/i }).click();
  await expect(page.getByRole('tab', { name: /dashboard/i })).toBeVisible();
  await expect(page.getByText(/kg CO2e/i).first()).toBeVisible();
});

test('page includes SEO and Open Graph meta tags', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    'content',
    /carbon footprint/i
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    /CarbonWise Coach/i
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-image\.png/);
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
});
test('skip link targets main content', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /skip to main content/i }).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});
