import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 300 * 1000,
  expect: {
    timeout: 300 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["junit", { outputFile: "results.xml" }], ["html"]],
  use: {
    viewport: {
      width: 1440,
      height: 820,
    },
    actionTimeout: 0,
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    headless: false,
    testIdAttribute: "data-pw",
  },
  // start local web server before tests

  webServer: [
    {
      command: "yarn start:senate",
      url: "http://localhost:3000",
      timeout: 60000,
      reuseExistingServer: !process.env.CI,
    },
  ],

  projects: [
    {
      name: "setup",
      testMatch: /global.setup\.ts/,
      teardown: "cleanup",
    },
    {
      name: "cleanup",
      testMatch: /global.teardown\.ts/,
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
    },
  ],
});
