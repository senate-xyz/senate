import { expect, test } from "@playwright/test";
import { test as test_metamask } from "../../../../fixtures";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { db, eq, sql, user, userTovoter, voter } from "@senate/database";

test("deletes test user test@test.com start", async ({}) => {
  await db.delete(user).where(eq(user.email, "test@test.com"));
});

let numberOfUsers;

test_metamask(
  "creates new address user, subscribes to Compound, sets email to name@test.com, confirms email..",
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

    const newUser = await db.query.user.findFirst({
      where: eq(user.email, "name@test.com"),
    });

    await expect(newUser?.email).toBe("name@test.com");
    await expect(newUser?.isaaveuser).toBe("DISABLED");
    await expect(newUser?.verifiedaddress).toBe(true);
    await expect(newUser?.verifiedemail).toBe(false);
    await expect(newUser?.emaildailybulletin).toBe(true);
    await expect(newUser?.emailquorumwarning).toBe(true);
    await expect(newUser?.challengecode.length).toBeGreaterThan(5);

    await page.goto(`/verify/verify-email/${newUser?.challengecode}`);

    await page.waitForTimeout(5000);

    await expect(page).toHaveURL("/orgs?connect");

    const verifiedUser = await db.query.user.findFirst({
      where: eq(user.email, "name@test.com"),
    });

    await expect(verifiedUser?.email).toBe("name@test.com");
    await expect(verifiedUser?.isaaveuser).toBe("DISABLED");
    await expect(verifiedUser?.verifiedaddress).toBe(true);
    await expect(verifiedUser?.verifiedemail).toBe(true);
    await expect(verifiedUser?.emaildailybulletin).toBe(true);
    await expect(verifiedUser?.emailquorumwarning).toBe(true);

    numberOfUsers = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(user);
  }
);

test("subscribes test@test.com to Aave using discourse api", async ({}) => {
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

  let newNumberOfUsers = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(user);

  await expect(newNumberOfUsers[0].count).toBe(numberOfUsers[0].count + 1);
});

test_metamask(
  "confirms new email account by signing message",
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

    await expect(page).toHaveURL("/orgs?connect");

    let newNumberOfUsers = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(user);

    await expect(newNumberOfUsers[0].count).toBe(numberOfUsers[0].count);
  }
);

test("has email updated to test@test.com, is verified, has bulletin and quorum enabled, is subscribed to Aave and Compound", async ({
  page,
}) => {
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

  const votersAddresses = proxies.map((p) => (p.voter ? p.voter?.address : ""));

  const oldEmailUser = await db.query.user.findFirst({
    where: eq(user.email, "name@test.com"),
  });

  await expect(oldEmailUser).toBeUndefined();

  await expect(confirmedUser?.address).toBe(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  );
  await expect(confirmedUser?.email).toBe("test@test.com");
  await expect(confirmedUser?.isaaveuser).toBe("ENABLED");
  await expect(confirmedUser?.verifiedaddress).toBe(true);
  await expect(confirmedUser?.verifiedemail).toBe(true);
  await expect(confirmedUser?.challengecode).toBe("");
  await expect(confirmedUser?.emaildailybulletin).toBe(true);
  await expect(confirmedUser?.emailquorumwarning).toBe(true);
  await expect(confirmedUser?.subscriptions.map((s) => s.dao.name)).toContain(
    "Aave"
  );
  await expect(confirmedUser?.subscriptions.map((s) => s.dao.name)).toContain(
    "Compound"
  );
  await expect(votersAddresses).toContain(confirmedUser?.address);

  let newNumberOfUsers = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(user);

  await expect(newNumberOfUsers[0].count).toBe(numberOfUsers[0].count);
});

test("deletes test user test@test.com end", async ({}) => {
  await db.delete(user).where(eq(user.email, "test@test.com"));
});
