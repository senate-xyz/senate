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
  await expect(page).toHaveURL(
    "/proposals/active?from=any&end=365&voted=any&proxy=any"
  );
});

test("settings navbar link", async ({ page }) => {
  await page.getByTestId("navbar").getByText("Settings").click();
  await expect(page).toHaveURL("/settings/account");
});

test("twitter link", async ({ page }) => {
  await page.getByTestId("navbar").getByAltText("twitter").click();
  await expect(page).toHaveURL(
    "https://twitter.com/i/flow/login?redirect_after_login=%2FSenateLabs"
  );
});

test("discord link", async ({ page }) => {
  await page.getByTestId("navbar").getByAltText("discord").click();
  await expect(page).toHaveURL("https://discord.com/invite/shtxfNqazd");
});

test("github link", async ({ page }) => {
  await page.getByTestId("navbar").getByAltText("github").click();
  await expect(page).toHaveURL("https://github.com/senate-xyz/senate");
});

test("logo link", async ({ page }) => {
  await page.getByTestId("navbar").getByAltText("Senate logo").click();
  await expect(page).toHaveURL("/");
});
