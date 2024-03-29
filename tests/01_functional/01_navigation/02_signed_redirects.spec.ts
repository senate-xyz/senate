import { expect, test } from "@playwright/test";
import { test as test_metamask } from "../../../fixtures";
import * as metamask from "@synthetixio/synpress/commands/metamask";

test.beforeEach(async ({ page }) => {
  await page.goto("/orgs");
});

test_metamask(
  "signed notifications settings url does not redirect",
  async ({ page }) => {
    test_metamask.slow();
    await page.getByText("Connect Wallet").click();
    await page.getByText("MetaMask").click();
    await metamask.acceptAccess();

    await page.waitForTimeout(500);
    await page.getByText("Send message").click();
    await page.waitForTimeout(500);
    await metamask.confirmSignatureRequest();
    await page.waitForTimeout(500);

    await page.goto("/settings/notifications");
    await page.waitForTimeout(5000);
    await expect(page).toHaveURL("/settings/notifications");
  }
);

test_metamask(
  "signed proxy settings url does not redirect",
  async ({ page }) => {
    test_metamask.slow();
    await page.getByText("Connect Wallet").click();
    await page.getByText("MetaMask").click();
    await metamask.acceptAccess();

    await page.waitForTimeout(500);
    await page.getByText("Send message").click();
    await page.waitForTimeout(500);
    await metamask.confirmSignatureRequest();
    await page.waitForTimeout(500);

    await page.goto("/settings/proxy");
    await page.waitForTimeout(5000);
    await expect(page).toHaveURL("/settings/proxy");
  }
);
