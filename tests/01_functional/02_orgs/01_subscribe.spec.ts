import { expect, test } from "@playwright/test";
import { test as test_metamask } from "../../../fixtures";
import * as metamask from "@synthetixio/synpress/commands/metamask";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test_metamask("unsigned subscribe to Aave", async ({ page }) => {
  await page
    .getByTestId("unsubscribed-list")
    .getByTestId("Aave")
    .getByTestId("subscribe-button")
    .click();

  await page.getByText("MetaMask").click();
  await metamask.acceptAccess();

  await page.waitForTimeout(500);
  await page.getByText("Send message").click();
  await page.waitForTimeout(500);
  await metamask.confirmSignatureRequest();
  await page.waitForTimeout(500);

  await expect(
    page.getByTestId("subscribed-list").getByTestId("Aave")
  ).toBeVisible();
});

test_metamask("signed subscribe to Aave", async ({ page }) => {
  await page.getByText("Connect Wallet").click();
  await page.getByText("MetaMask").click();
  await metamask.acceptAccess();

  await page.waitForTimeout(500);
  await page.getByText("Send message").click();
  await page.waitForTimeout(500);
  await metamask.confirmSignatureRequest();
  await page.waitForTimeout(500);

  await page
    .getByTestId("unsubscribed-list")
    .getByTestId("Aave")
    .getByTestId("subscribe-button")
    .click();

  await expect(
    page.getByTestId("subscribed-list").getByTestId("Aave")
  ).toBeVisible();
});
