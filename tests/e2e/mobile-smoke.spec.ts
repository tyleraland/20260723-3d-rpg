import { expect, test } from '@playwright/test';

test('fits the mobile viewport without document scrolling', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByLabel('Ashfall patrol simulation')).toBeVisible();
  await page.getByRole('button', { name: 'Debug' }).click();
  await expect(page.getByLabel('Renderer statistics')).toContainText('20');
  await page.waitForTimeout(500);
  const dimensions = await page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    innerHeight: window.innerHeight
  }));
  expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.innerHeight);
  expect(pageErrors).toEqual([]);
});
