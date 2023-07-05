import { test, expect } from "../fixtures";
import * as metamask from "@synthetixio/synpress/commands/metamask";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("connects wallet using default metamask account", async ({ page }) => {
  await page.click("#connectButton");
});
