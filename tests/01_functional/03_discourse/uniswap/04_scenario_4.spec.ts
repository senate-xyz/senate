import { expect, test } from "@playwright/test";
import { test as test_metamask } from "../../../../fixtures";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { prisma } from "@senate/database";

test("deletes test user test@test.com start", async ({}) => {
  await prisma.user.deleteMany({
    where: { email: "test@test.com" },
  });
});

test_metamask(
  "creates new address user, subscribes to Compound, sets email to name@test.com (force confirmed)..",
  async ({ page }) => {
    await page.goto("/orgs");
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
      .getByTestId("Compound")
      .getByTestId("subscribe-button")
      .click();

    await expect(
      page.getByTestId("subscribed-list").getByTestId("Compound")
    ).toBeVisible();

    await page.goto("/settings/notifications");

    await page.getByTestId("bulletin-enabled").click();

    await page.getByTestId("email-input").fill("name@test.com");

    await page.getByTestId("email-save").click();

    await expect(page.getByTestId("email-unverified")).toBeVisible();

    await prisma.user.updateMany({
      where: { email: "test@test.com" },
      data: {
        challengecode: "",
        verifiedemail: true,
      },
    });
  }
);

test("subscribes test@test.com to Uniswap using discourse api", async ({}) => {
  let response;

  await test.step("calls discourse api for test@test.com", async () => {
    response = await fetch(
      "http://127.0.0.1:3000/api/discourse/uniswap-magic-user",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: "test@test.com" }),
      }
    );
  });

  await expect(response.status).toBe(200);

  const newUser = await prisma.user.findFirst({
    where: { email: "test@test.com" },
  });

  await expect(await response.json()).toStrictEqual({
    email: "test@test.com",
    result: "success",
    url: `http://127.0.0.1:3000/verify/signup-discourse/uniswap/${newUser?.challengecode}`,
  });

  await expect(newUser?.email).toBe("test@test.com");
  await expect(newUser?.isuniswapuser).toBe("VERIFICATION");
  await expect(newUser?.verifiedaddress).toBe(false);
  await expect(newUser?.verifiedemail).toBe(false);
  await expect(newUser?.emaildailybulletin).toBe(true);
  await expect(newUser?.emailquorumwarning).toBe(true);
});

test_metamask(
  "confirms new email account by signing message",
  async ({ page }) => {
    const newUser = await prisma.user.findFirst({
      where: { email: "test@test.com" },
    });

    await page.goto(
      `http://127.0.0.1:3000/verify/signup-discourse/uniswap/${newUser?.challengecode}`
    );

    await page.getByText("Connect Wallet").click();
    await page.getByText("MetaMask").click();
    await metamask.acceptAccess();
    await page.waitForTimeout(5000);
    await metamask.confirmSignatureRequest();

    await page.waitForTimeout(10000);

    await expect(page).toHaveURL("/orgs?connect");
  }
);

test("has email updated to test@test.com, is verified, has bulletin and quorum enabled, is subscribed to Uniswap and Compound", async ({
  page,
}) => {
  const confirmedUser = await prisma.user.findFirst({
    where: { email: "test@test.com" },
    include: {
      subscriptions: { include: { dao: { select: { name: true } } } },
    },
  });

  const oldEmailUser = await prisma.user.findFirst({
    where: { email: "name@test.com" },
    include: {
      subscriptions: { include: { dao: { select: { name: true } } } },
    },
  });

  await expect(oldEmailUser).toBeNull();

  await expect(confirmedUser?.email).toBe("test@test.com");
  await expect(confirmedUser?.isuniswapuser).toBe("ENABLED");
  await expect(confirmedUser?.verifiedaddress).toBe(true);
  await expect(confirmedUser?.verifiedemail).toBe(true);
  await expect(confirmedUser?.challengecode).toBe("");
  await expect(confirmedUser?.emaildailybulletin).toBe(true);
  await expect(confirmedUser?.emailquorumwarning).toBe(true);
  await expect(confirmedUser?.subscriptions.map((s) => s.dao.name)).toContain(
    "Uniswap"
  );
  await expect(confirmedUser?.subscriptions.map((s) => s.dao.name)).toContain(
    "Compound"
  );
});

test("deletes test user test@test.com end", async ({}) => {
  await prisma.user.deleteMany({
    where: { email: "test@test.com" },
  });
});
