import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "html",
  timeout: 60 * 60 * 1000,

  use: {
    ...devices["Desktop Chrome"],
  },

  projects: [
    {
      name: "collectProductUrls",
      testMatch: /1907perfumeries\.spec\.ts/,
      grep: /collectProductUrls$/,
    },
    {
      name: "collectProducts",
      testMatch: /1907perfumeries\.spec\.ts/,
      grep: /collectProducts$/,
      dependencies: ["collectProductUrls"],
    },
  ],
});
