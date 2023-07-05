import { test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("connects wallet using default metamask account", async ({ page }) => {
  await page.getByText("Connect Wallet").click();
});
