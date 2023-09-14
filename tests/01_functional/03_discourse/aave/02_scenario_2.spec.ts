import { expect, test } from "@playwright/test";
import { test as test_metamask } from "../../../../fixtures";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { db, eq, sql, user, userTovoter, voter } from "@senate/database";

test("deletes test user test@test.com start", async ({}) => {
  await db.delete(user).where(eq(user.email, "test@test.com"));
});

let numberOfUsers;

test_metamask(
  "creates new address user and subscribes to Compound",
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

    numberOfUsers = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(user);
  }
);

test("creates new email account test@test.com using discourse api", async ({}) => {
  let response;

  await test.step("calls discourse api for test@test.com", async () => {
    response = await fetch(
      "http://localhost:3000/api/discourse/aave-magic-user",
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

  const newUser = await db.query.user.findFirst({
    where: eq(user.email, "test@test.com"),
  });

  await expect(await response.json()).toStrictEqual({
    email: "test@test.com",
    result: "success",
    url: `http://localhost:3000/verify/signup-discourse/aave/${newUser?.challengecode}`,
  });

  await expect(newUser?.email).toBe("test@test.com");
  await expect(newUser?.isaaveuser).toBe("VERIFICATION");
  await expect(newUser?.verifiedaddress).toBe(false);
  await expect(newUser?.verifiedemail).toBe(false);
  await expect(newUser?.emaildailybulletin).toBe(false);
  await expect(newUser?.emailquorumwarning).toBe(true);
  await expect(newUser?.challengecode.length).toBeGreaterThan(5);

  let newNumberOfUsers = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(user);

  await expect(newNumberOfUsers[0].count).toBe(numberOfUsers[0].count + 1);
});

test("two users exist, address user and email user", async ({}) => {
  const addressUser = await db.query.user.findFirst({
    where: eq(user.address, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
  });

  const emailUser = await db.query.user.findFirst({
    where: eq(user.email, "test@test.com"),
  });

  await expect(addressUser?.id).not.toBe(emailUser?.id);

  await expect(addressUser?.email).toBeNull();
  await expect(addressUser?.isaaveuser).toBe("DISABLED");
  await expect(addressUser?.verifiedaddress).toBe(true);
  await expect(addressUser?.verifiedemail).toBe(false);
  await expect(addressUser?.emaildailybulletin).toBe(false);
  await expect(addressUser?.emailquorumwarning).toBe(true);
  await expect(addressUser?.challengecode.length).toBe(0);

  await expect(emailUser?.email).toBe("test@test.com");
  await expect(emailUser?.isaaveuser).toBe("VERIFICATION");
  await expect(emailUser?.verifiedaddress).toBe(false);
  await expect(emailUser?.verifiedemail).toBe(false);
  await expect(emailUser?.emaildailybulletin).toBe(false);
  await expect(emailUser?.emailquorumwarning).toBe(true);
  await expect(emailUser?.challengecode.length).toBeGreaterThan(5);

  let newNumberOfUsers = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(user);

  await expect(newNumberOfUsers[0].count).toBe(numberOfUsers[0].count + 1);
});

test_metamask(
  "confirms new email account test@test.com by signing message",
  async ({ page }) => {
    const newUser = await db.query.user.findFirst({
      where: eq(user.email, "test@test.com"),
    });

    await page.goto(
      `http://localhost:3000/verify/signup-discourse/aave/${newUser?.challengecode}`
    );

    await page.getByText("Connect Wallet").click();
    await page.getByText("MetaMask").click();
    await metamask.acceptAccess();
    await metamask.confirmSignatureRequest();

    await page.waitForTimeout(10000);

    const confirmedUser = await db.query.user.findFirst({
      where: eq(user.email, "test@test.com"),
      with: {
        subscriptions: { with: { dao: true } },
      },
    });

    const proxies = await db
      .select()
      .from(userTovoter)
      .leftJoin(user, eq(userTovoter.a, user.id))
      .leftJoin(voter, eq(userTovoter.b, voter.id))
      .where(confirmedUser ? eq(user.id, confirmedUser.id) : undefined);

    const votersAddresses = proxies.map((p) =>
      p.voter ? p.voter?.address : ""
    );

    await expect(confirmedUser?.email).toBe("test@test.com");
    await expect(confirmedUser?.isaaveuser).toBe("ENABLED");
    await expect(confirmedUser?.verifiedaddress).toBe(true);
    await expect(confirmedUser?.verifiedemail).toBe(true);
    await expect(confirmedUser?.challengecode.length).toBe(0);
    await expect(confirmedUser?.emaildailybulletin).toBe(true);
    await expect(confirmedUser?.emailquorumwarning).toBe(true);
    await expect(confirmedUser?.subscriptions.map((s) => s.dao.name)).toContain(
      "Aave"
    );
    await expect(confirmedUser?.subscriptions.map((s) => s.dao.name)).toContain(
      "Compound"
    );
    await expect(votersAddresses).toContain(confirmedUser?.address);

    await expect(page).toHaveURL("/orgs?connect");

    let newNumberOfUsers = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(user);

    await expect(newNumberOfUsers[0].count).toBe(numberOfUsers[0].count);
  }
);

test_metamask(
  "user has test@test.com email verified, bulletin and quorum enabled and is subscribed to Aave and Compound",
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

    await test.step("be subscribed to Compound", async () => {
      await expect(
        page.getByTestId("subscribed-list").getByTestId("Compound")
      ).toBeVisible();
    });

    await page.goto("/settings/notifications");

    await expect(page.getByTestId("email-settings")).toBeVisible();

    await expect(
      page.getByTestId("email-settings").getByTestId("bulletin-enabled")
    ).toBeChecked();

    await expect(
      page.getByTestId("email-settings").getByTestId("bulletin-email")
    ).toHaveText("test@test.com");

    await expect(page.getByTestId("email-unverified")).toBeHidden();

    await expect(
      page.getByTestId("email-settings").getByTestId("quorum-enabled")
    ).toBeChecked();
  }
);

test("deletes test user test@test.com end", async ({}) => {
  await db.delete(user).where(eq(user.email, "test@test.com"));
});
