import { test as base, chromium, type BrowserContext } from "@playwright/test";
import { initialSetup } from "@synthetixio/synpress/commands/metamask";
import { prepareMetamask } from "@synthetixio/synpress/helpers";

export const test = base.extend<{
  context: BrowserContext;
}>({
  context: async ({}, use) => {
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
      "--disable-dev-shm-usage",
      "--ipc=host",
      "--single-process",
      "--disable-gpu",
    ];

    if (process.env.HEADLESS_MODE) {
      browserArgs.push("--headless=new");
    }
    console.log(browserArgs);
    // launch browser
    const context = await chromium.launchPersistentContext(
      "/tmp/test-user-data",
      {
        headless: false,
        args: browserArgs,
      }
    );
    // wait for metamask
    await context.pages()[0].waitForTimeout(process.env.CI ? 10000 : 2000);
    // setup metamask
    await initialSetup(chromium, {
      secretWordsOrPrivateKey:
        "test test test test test test test test test test test junk",
      network: "mainnet",
      password: "Tester@1234",
      enableAdvancedSettings: true,
      enableExperimentalSettings: true,
    });
    await use(context);
    await context.close();
  },
});
export const expect = test.expect;
