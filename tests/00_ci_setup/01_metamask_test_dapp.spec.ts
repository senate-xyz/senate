import { test, expect } from "../../fixtures";
import * as metamask from "@synthetixio/synpress/commands/metamask";

test.beforeEach(async ({ page }) => {
  // baseUrl is set in playwright.config.ts
  await page.goto("https://metamask.github.io/test-dapp");
});

test("connect wallet using default metamask account", async ({ page }) => {
  await page.click("#connectButton");
  await metamask.acceptAccess();
  await expect(page.locator("#accounts")).toHaveText(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
  );
});
