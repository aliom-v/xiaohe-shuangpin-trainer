import { test, expect } from '@playwright/test'

test('loads trainer landing page', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '小鹤双拼练习器' })).toBeVisible()
  await expect(page.getByPlaceholder('在此粘贴要练习的文本，或点击随机文本...')).toBeVisible()
})
