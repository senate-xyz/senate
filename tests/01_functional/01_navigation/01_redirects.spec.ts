import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("root url redirects to /orgs", async ({ page }) => {
  await expect(page).toHaveURL("/orgs");
});

test("proposals url redirects to active proposals", async ({ page }) => {
  await page.goto("/proposals");
  await expect(page).toHaveURL(
    "proposals/active?from=any&end=365&voted=any&proxy=any"
  );
});

test("active proposals url redirects to filters", async ({ page }) => {
  await page.goto("/proposals/active");
  await expect(page).toHaveURL(
    "/proposals/active?from=any&end=365&voted=any&proxy=any"
  );
});

test("past proposals url redirects to filters", async ({ page }) => {
  await page.goto("/proposals/past");
  await expect(page).toHaveURL(
    "/proposals/past?from=any&end=30&voted=any&proxy=any"
  );
});

test("settings url redirects to settings account", async ({ page }) => {
  await page.goto("/settings");
  await expect(page).toHaveURL("/settings/account");
});

test("unsigned proxy settings url redirects to settings account", async ({
  page,
}) => {
  await page.goto("/settings/proxy");
  await expect(page).toHaveURL("/settings/account");
});

test("unsigned notifications settings url redirects to settings account", async ({
  page,
}) => {
  await page.goto("/settings/notifications");
  await expect(page).toHaveURL("/settings/account");
});
