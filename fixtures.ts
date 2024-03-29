import { test as base, chromium, type BrowserContext } from "@playwright/test";
import { initialSetup } from "@synthetixio/synpress/commands/metamask";
import { prepareMetamask } from "@synthetixio/synpress/helpers";
import dotenv from "dotenv";
export const test = base.extend<{
  context: BrowserContext;
}>({
  context: async ({}, use) => {
    dotenv.config();
    // required for synpress
    global.expect = expect;
    // download metamask
    const metamaskPath = await prepareMetamask(
      process.env.METAMASK_VERSION || "10.25.0"
    );
    // prepare browser args
    const browserArgs = [
      `--disable-extensions-except=${metamaskPath}`,
      `--load-extension=${metamaskPath}`,
      "--remote-debugging-port=9222",
    ];
    if (process.env.CI) {
      browserArgs.push("--disable-gpu");
    }

    // launch browser
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: browserArgs,
    });
    context.setDefaultTimeout(120 * 1000);
    // wait for metamask
    await context.pages()[0].waitForTimeout(3000);
    // setup metamask
    await initialSetup(chromium, {
      secretWordsOrPrivateKey:
        "test test test test test test test test test test test junk",
      network: "mainnet",
      password: "Tester@1234",
      enableAdvancedSettings: true,
    });
    await context.pages()[0].close();
    await use(context);
    if (!process.env.SERIAL_MODE) {
      await context.close();
    }
  },
});
export const expect = test.expect;
