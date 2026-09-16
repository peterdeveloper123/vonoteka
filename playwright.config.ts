import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "html",
  timeout: 60 * 60 * 1000,

  use: {
    ...devices["Desktop Chrome"],
  },

  testMatch: ["**/1907perfumeries.spec.ts"],

  projects: [
    {
      name: "1907perfumeriesCollectProductUrls",
      testMatch: /1907perfumeries\.spec\.ts/,
      grep: /1907perfumeriesCollectProductUrls$/,
    },
    {
      name: "1907perfumeriesCollectProducts",
      testMatch: /1907perfumeries\.spec\.ts/,
      grep: /1907perfumeriesCollectProducts$/,
      dependencies: ["1907perfumeriesCollectProductUrls"],
    },
    {
      name: "leparfumlechicCollectProductUrls",
      testMatch: /leparfumlechic\.spec\.ts/,
      grep: /leparfumlechicCollectProductUrls$/,
    },
    {
      name: "leparfumlechicCollectProducts",
      testMatch: /leparfumlechic\.spec\.ts/,
      grep: /leparfumlechicCollectProducts$/,
      dependencies: ["leparfumlechicCollectProductUrls"],
    },
  ],
});
