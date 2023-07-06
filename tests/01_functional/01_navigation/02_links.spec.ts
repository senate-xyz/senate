import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("orgs navbar link", async ({ page }) => {
  await page.getByTestId("navbar").getByText("Orgs").click();
  await expect(page).toHaveURL("/orgs");
});

test("proposals navbar link", async ({ page }) => {
  await page.getByTestId("navbar").getByText("Proposals").click();
  await page.waitForURL(
    "/proposals/active?from=any&end=365&voted=any&proxy=any"
  );
});

test("settings navbar link", async ({ page }) => {
  await page.getByTestId("navbar").getByText("Settings").click();
  await page.waitForURL("/settings/account");
});

test("twitter link", async ({ page }) => {
  await page.getByTestId("navbar").getByAltText("twitter").click();
  await page.waitForURL(
    "https://twitter.com/i/flow/login?redirect_after_login=%2FSenateLabs"
  );
});

test("discord link", async ({ page }) => {
  await page.getByTestId("navbar").getByAltText("discord").click();
  await page.waitForURL("https://discord.com/invite/shtxfNqazd");
});

test("github link", async ({ page }) => {
  await page.getByTestId("navbar").getByAltText("github").click();
  await page.waitForURL("https://github.com/senate-xyz/senate");
});
