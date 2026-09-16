import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "html",

  use: {
    ...devices["Desktop Chrome"],
  },

  projects: [
    {
      name: "getProductUrls",
      testMatch: /1907perfumeries\.spec\.ts/,
    },
    {
      name: "getProducts",
      testMatch: /1907perfumeries\.spec\.ts/,
      dependencies: ["getProductUrls"],
    },
  ],
});
