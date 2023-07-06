import { expect, test } from "@playwright/test";
import { test as test_metamask } from "../../../fixtures";
import * as metamask from "@synthetixio/synpress/commands/metamask";

let sharedPage;

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ page }) => {
  sharedPage = page;
  await sharedPage.goto("/");
});

test.afterAll(async ({ context }) => {
  await context.close();
});

test("root url redirects to /orgs", async ({}) => {
  await expect(sharedPage).toHaveURL("/orgs");
});

test("proposals url redirects to active proposals", async ({}) => {
  await sharedPage.goto("/proposals");

  await expect(sharedPage).toHaveURL(
    "/proposals/active?from=any&end=365&voted=any&proxy=any"
  );
});

test("active proposals url redirects to filters", async ({}) => {
  await sharedPage.goto("/proposals/active");

  await expect(sharedPage).toHaveURL(
    "/proposals/active?from=any&end=365&voted=any&proxy=any"
  );
});

test("past proposals url redirects to filters", async ({}) => {
  await sharedPage.goto("/proposals/past");

  await expect(sharedPage).toHaveURL(
    "/proposals/past?from=any&end=30&voted=any&proxy=any"
  );
});

test("settings url redirects to settings account", async ({}) => {
  await sharedPage.goto("/settings");
  await expect(sharedPage).toHaveURL("/settings/account");
});

test("unsigned notifications settings url redirects to settings account", async ({}) => {
  await sharedPage.goto("/settings/notifications", { timeout: 60 * 1000 });
  await expect(sharedPage).toHaveURL("/settings/account");
});

test("unsigned proxy settings url redirects to settings account", async ({}) => {
  await sharedPage.goto("/settings/proxy", { timeout: 60 * 1000 });
  await expect(sharedPage).toHaveURL("/settings/account");
});
