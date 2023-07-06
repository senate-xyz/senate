import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("root url redirects to /orgs", async ({ page }) => {
  await page.waitForURL("/orgs");
});

test("proposals url redirects to active proposals", async ({ page }) => {
  await page.goto("/proposals");
  await page.waitForURL(
    "/proposals/active?from=any&end=365&voted=any&proxy=any"
  );
});

test("active proposals url redirects to filters", async ({ page }) => {
  await page.goto("/proposals/active");
  await page.waitForURL(
    "/proposals/active?from=any&end=365&voted=any&proxy=any"
  );
});

test("past proposals url redirects to filters", async ({ page }) => {
  await page.goto("/proposals/past");
  await page.waitForURL("/proposals/past?from=any&end=30&voted=any&proxy=any");
});

test("settings url redirects to settings account", async ({ page }) => {
  await page.goto("/settings");
  await page.waitForURL("/settings/account");
});

test("unsigned proxy settings url redirects to settings account", async ({
  page,
}) => {
  await page.goto("/settings/proxy");
  await page.waitForURL("/settings/account");
});

test("unsigned notifications settings url redirects to settings account", async ({
  page,
}) => {
  await page.goto("/settings/notifications");
  await page.waitForURL("/settings/account");
});
