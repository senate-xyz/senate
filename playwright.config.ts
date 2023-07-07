import { defineConfig, devices } from "@playwright/test";

const port = 3000;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./tests",
  timeout: 60 * 1000,
  expect: {
    timeout: 60 * 1000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["list"], ["junit", { outputFile: "results.xml" }], ["html"]],
  use: {
    baseURL,
    viewport: {
      width: 1440,
      height: 820,
    },
    actionTimeout: 0,
    trace: "retry-with-trace",
    headless: false,
  },

  webServer: [
    {
      port,
      command: "yarn start:senate",
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
