import { expect, test } from "@playwright/test";
import { test as test_metamask } from "../../../../fixtures";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { db, eq, user, userTovoter, voter } from "@senate/database";

test("deletes test user test@test.com start", async ({}) => {
  await db.delete(user).where(eq(user.email, "test@test.com"));
});

test_metamask(
  "creates new address user, subscribes to Compound, sets email to test@test.com (force confirmed)",
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

    await page.getByTestId("email-input").fill("test@test.com");

    await page.getByTestId("email-save").click();

    await expect(page.getByTestId("email-unverified")).toBeVisible();

    await db
      .update(user)
      .set({
        challengecode: "",
        verifiedemail: true,
      })
      .where(eq(user.email, "test@test.com"));
  }
);

test("subscribes test@test.com to Aave using discourse api", async ({}) => {
  let response;

  await test.step("calls discourse api for test@test.com", async () => {
    response = await fetch(
      "http://127.0.0.1:3000/api/discourse/aave-magic-user",
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
    url: `http://127.0.0.1:3000/verify/subscribe-discourse/aave/${newUser?.challengecode}`,
  });

  await expect(newUser?.email).toBe("test@test.com");
  await expect(newUser?.isaaveuser).toBe("VERIFICATION");
  await expect(newUser?.verifiedaddress).toBe(true);
  await expect(newUser?.verifiedemail).toBe(true);
  await expect(newUser?.emaildailybulletin).toBe(true);
  await expect(newUser?.emailquorumwarning).toBe(true);
});

test("confirms aave subscription by visiting page, no sign message required", async ({
  page,
}) => {
  const newUser = await db.query.user.findFirst({
    where: eq(user.email, "test@test.com"),
  });

  await page.goto(
    `http://127.0.0.1:3000/verify/subscribe-discourse/aave/${newUser?.challengecode}`
  );

  await page.getByText("Go back home").click();

  await expect(page).toHaveURL("/orgs?connect");
});

test("has email test@test.com, is verified, has bulletin and quorum enabled, is subscribed to Aave and Compound", async ({
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
});

test("deletes test user test@test.com end", async ({}) => {
  await db.delete(user).where(eq(user.email, "test@test.com"));
});
