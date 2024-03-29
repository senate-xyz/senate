import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/orgs");
});

test("wallet connect button works without metamask", async ({ page }) => {
  await page.getByText("Connect Wallet").click();
  await page.getByText("MetaMask").click();
  await expect(page.locator("body")).toContainText("Scan with MetaMask");
});

test("has all wallet connectors", async ({ page }) => {
  await page.getByText("Connect Wallet").click();

  await expect(page.locator("body")).toContainText("Connect Wallet");
  await expect(page.locator("body")).toContainText("MetaMask");
  await expect(page.locator("body")).toContainText("WalletConnect");
  await expect(page.locator("body")).toContainText("Coinbase Wallet");
  await expect(page.locator("body")).toContainText("Ledger Live");
  await expect(page.locator("body")).toContainText("Rabby Wallet");
});
