import { expect, test } from "@playwright/test";
import { test as test_metamask } from "../../../fixtures";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import { prisma } from "@senate/database";

test("creates account for new email", async ({}) => {
  await prisma.user.deleteMany({ where: { email: "test@senatelabs.xyz" } });

  const response = await fetch(
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

  expect(response.status).toBe(200);

  const newUser = await prisma.user.findFirst({
    where: { email: "test@senatelabs.xyz" },
  });

  expect(await response.json()).toStrictEqual({
    email: "test@senatelabs.xyz",
    result: "success",
    url: process.env.CI
      ? `/verify/signup-discourse/aave/${newUser?.challengecode}`
      : `http://127.0.0.1:3000/verify/signup-discourse/aave/${newUser?.challengecode}`,
  });

  expect(newUser?.email).toBe("test@senatelabs.xyz");
  expect(newUser?.isaaveuser).toBe("VERIFICATION");
  expect(newUser?.verifiedaddress).toBe(false);
  expect(newUser?.verifiedemail).toBe(false);
  expect(newUser?.emaildailybulletin).toBe(true);
  expect(newUser?.emailquorumwarning).toBe(true);
});

test_metamask("confirms new account by signing message", async ({ page }) => {
  const newUser = await prisma.user.findFirst({
    where: { email: "test@senatelabs.xyz" },
  });

  page.goto(
    `http://127.0.0.1:3000/verify/signup-discourse/aave/${newUser?.challengecode}`
  );

  await page.getByText("Connect Wallet").click();
  await page.getByText("MetaMask").click();
  await metamask.acceptAccess();
  await page.waitForTimeout(5000);
  await metamask.confirmSignatureRequest();
  await page.waitForTimeout(5000);

  const confirmedUser = await prisma.user.findFirst({
    where: { email: "test@senatelabs.xyz" },
  });

  await expect(confirmedUser?.email).toBe("test@senatelabs.xyz");
  await expect(confirmedUser?.isaaveuser).toBe("ENABLED");
  await expect(confirmedUser?.verifiedaddress).toBe(true);
  await expect(confirmedUser?.verifiedemail).toBe(true);
  await expect(confirmedUser?.challengecode).toBe("");
  await expect(confirmedUser?.emaildailybulletin).toBe(true);
  await expect(confirmedUser?.emailquorumwarning).toBe(true);

  await expect(page).toHaveURL("/orgs?connect");
});
