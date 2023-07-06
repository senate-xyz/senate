import { test, expect } from "../../fixtures";
import * as metamask from "@synthetixio/synpress/commands/metamask";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("wallet connect button works with metamask", async ({ page }) => {
  await page.getByText("Connect Wallet").click();
  await page.getByText("MetaMask").click();
  await metamask.acceptAccess();

  await page.waitForTimeout(500);
  await page.getByText("Send message").click();
  await page.waitForTimeout(500);
  await metamask.confirmSignatureRequest();
  await page.waitForTimeout(500);
  await expect(page.locator("body")).toContainText("0xf3…2266");
});
