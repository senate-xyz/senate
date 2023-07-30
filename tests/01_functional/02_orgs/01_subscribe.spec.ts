import { expect, test } from "@playwright/test";
import { test as test_metamask } from "../../../fixtures";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { dao, db, eq, subscription, user } from "@senate/database";

test.beforeEach(async ({ page }) => {
  await page.goto("/orgs");
});

test_metamask("expect to have all daos unsubscribed", async ({ page }) => {
  await page.getByText("Connect Wallet").click();
  await page.getByText("MetaMask").click();
  await metamask.acceptAccess();
  await page.waitForTimeout(500);
  await page.getByText("Send message").click();
  await page.waitForTimeout(500);
  await metamask.confirmSignatureRequest();
  await page.waitForTimeout(5000);

  const numberOfDaos = (await db.select().from(dao)).length;

  await expect(
    await page.getByTestId("unsubscribed-list").getByRole("listitem")
  ).toHaveCount(numberOfDaos);
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

test_metamask("signed subscribe to Uniswap", async ({ page }) => {
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
    .getByTestId("Uniswap")
    .getByTestId("subscribe-button")
    .click();

  await expect(
    page.getByTestId("subscribed-list").getByTestId("Uniswap")
  ).toBeVisible();
});

test_metamask("expect to be subscribed to 2 daos", async ({ page }) => {
  await page.getByText("Connect Wallet").click();
  await page.getByText("MetaMask").click();
  await metamask.acceptAccess();
  await page.waitForTimeout(500);
  await page.getByText("Send message").click();
  await page.waitForTimeout(500);
  await metamask.confirmSignatureRequest();
  await page.waitForTimeout(500);

  await expect(
    await page.getByTestId("subscribed-list").getByRole("listitem")
  ).toHaveCount(2);
});

test_metamask("subscribe to all daos", async ({ page }) => {
  test_metamask.slow();

  await page.getByText("Connect Wallet").click();
  await page.getByText("MetaMask").click();
  await metamask.acceptAccess();
  await page.waitForTimeout(500);
  await page.getByText("Send message").click();
  await page.waitForTimeout(500);
  await metamask.confirmSignatureRequest();

  await page.waitForTimeout(500);

  await expect(
    await page.getByTestId("subscribed-list").getByRole("listitem")
  ).toHaveCount(2);

  let currentCount = 2;

  const numberOfDaos = (await db.select().from(dao)).length;

  while (currentCount < numberOfDaos) {
    await test.step(`Create subscription ${currentCount}`, async () => {
      await page.getByTestId("subscribe-button").first().click();
      currentCount++;
      await expect(
        await page.getByTestId("subscribed-list").getByRole("listitem")
      ).toHaveCount(currentCount, { timeout: 15000 });
    });
  }

  await expect(
    await page.getByTestId("subscribed-list").getByRole("listitem")
  ).toHaveCount(numberOfDaos);

  const [u] = await db
    .select()
    .from(user)
    .where(eq(user.address, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"));

  const numberOfSubscriptions = (
    await db.select().from(subscription).where(eq(subscription.userid, u.id))
  ).length;

  await expect(numberOfSubscriptions).toBe(numberOfDaos);
});

test_metamask("expect to be subscribed to all daos", async ({ page }) => {
  await page.getByText("Connect Wallet").click();
  await page.getByText("MetaMask").click();
  await metamask.acceptAccess();
  await page.waitForTimeout(500);
  await page.getByText("Send message").click();
  await page.waitForTimeout(500);
  await metamask.confirmSignatureRequest();
  await page.waitForTimeout(500);

  const numberOfDaos = (await db.select().from(dao)).length;
  await expect(
    await page.getByTestId("subscribed-list").getByRole("listitem")
  ).toHaveCount(numberOfDaos);
});
