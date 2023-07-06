import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("orgs link", async ({ page }) => {
  await page.getByTestId("navbar").getByText("Orgs").click();
  await expect(page).toHaveURL("/orgs");
});

test("proposals link", async ({ page }) => {
  await page.getByTestId("navbar").getByText("Proposals").click();
  await expect(page).toHaveURL(
    "http://localhost:3000/proposals/active?from=any&end=365&voted=any&proxy=any"
  );
});

test("settings link", async ({ page }) => {
  await page.getByTestId("navbar").getByText("Settings").click();
  await expect(page).toHaveURL("/settings/account");
});
