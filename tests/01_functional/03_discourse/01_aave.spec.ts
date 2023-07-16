import { expect, test } from "@playwright/test";
import { test as test_metamask } from "../../../fixtures";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { prisma } from "@senate/database";

test("creates account for new email", async ({}) => {
  await test.step("cleans up user test@senatelabs.xyz if exists", async () => {
    await prisma.user.deleteMany({ where: { email: "test@senatelabs.xyz" } });
  });

  let response;

  await test.step("calls discourse api for test@senatelabs.xyz", async () => {
    response = await fetch(
      "http://127.0.0.1:3000/api/discourse/aave-magic-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: "test@senatelabs.xyz" }),
      }
    );
  });

  await expect(response.status).toBe(200);

  const newUser = await prisma.user.findFirst({
    where: { email: "test@senatelabs.xyz" },
  });

  await expect(await response.json()).toStrictEqual({
    email: "test@senatelabs.xyz",
    result: "success",
    url: process.env.CI
      ? `/verify/signup-discourse/aave/${newUser?.challengecode}`
      : `http://127.0.0.1:3000/verify/signup-discourse/aave/${newUser?.challengecode}`,
  });

  await expect(newUser?.email).toBe("test@senatelabs.xyz");
  await expect(newUser?.isaaveuser).toBe("VERIFICATION");
  await expect(newUser?.verifiedaddress).toBe(false);
  await expect(newUser?.verifiedemail).toBe(false);
  await expect(newUser?.emaildailybulletin).toBe(true);
  await expect(newUser?.emailquorumwarning).toBe(true);
});

test_metamask("confirms new account by signing message", async ({ page }) => {
  const newUser = await prisma.user.findFirst({
    where: { email: "test@senatelabs.xyz" },
  });

  await page.goto(
    `http://127.0.0.1:3000/verify/signup-discourse/aave/${newUser?.challengecode}`
  );

  await page.getByText("Connect Wallet").click();
  await page.getByText("MetaMask").click();
  await metamask.acceptAccess();
  await page.waitForTimeout(5000);
  await metamask.confirmSignatureRequest();

  await page.waitForTimeout(10000);

  const confirmedUser = await prisma.user.findFirst({
    where: { email: "test@senatelabs.xyz" },
    include: {
      subscriptions: { include: { dao: { select: { name: true } } } },
    },
  });

  await expect(confirmedUser?.email).toBe("test@senatelabs.xyz");
  await expect(confirmedUser?.isaaveuser).toBe("ENABLED");
  await expect(confirmedUser?.verifiedaddress).toBe(true);
  await expect(confirmedUser?.verifiedemail).toBe(true);
  await expect(confirmedUser?.challengecode).toBe("");
  await expect(confirmedUser?.emaildailybulletin).toBe(true);
  await expect(confirmedUser?.emailquorumwarning).toBe(true);
  await expect(confirmedUser?.subscriptions[0].dao.name).toBe("Aave");

  await expect(page).toHaveURL("/orgs?connect");
});

test_metamask(
  "user has test@senatelabs.xyz email verified, bulletin and quorum enabled and is subscribed to aave",
  async ({ page }) => {
    await page.goto("/orgs");

    await page.getByText("Connect Wallet").click();
    await page.getByText("MetaMask").click();
    await metamask.acceptAccess();
    await page.waitForTimeout(500);
    await page.getByText("Send message").click();
    await page.waitForTimeout(500);
    await metamask.confirmSignatureRequest();
    await page.waitForTimeout(5000);

    await test.step("be subscribed to Aave", async () => {
      await expect(
        page.getByTestId("subscribed-list").getByTestId("Aave")
      ).toBeVisible();
    });

    await page.goto("/settings/notifications");

    await expect(page.getByTestId("email-settings")).toBeVisible();

    await expect(
      page.getByTestId("email-settings").getByTestId("bulletin-enabled")
    ).toBeChecked();

    await expect(
      page.getByTestId("email-settings").getByTestId("bulletin-email")
    ).toHaveText("test@senatelabs.xyz");

    await expect(page.getByTestId("email-unverified")).toBeHidden();

    await expect(
      page.getByTestId("email-settings").getByTestId("quorum-enabled")
    ).toBeChecked();

    await test.step("cleans up user test@senatelabs.xyz if exists", async () => {
      await prisma.user.deleteMany({
        where: { email: "test@senatelabs.xyz" },
      });
    });
  }
);
