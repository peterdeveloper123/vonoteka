import { defineConfig, devices } from "@playwright/test";

let runOnlyActive = true;
let activeTestFile = "muschio.spec.ts";

const projects = [
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
  {
    name: "muschioCollectProductUrls",
    testMatch: /muschio\.spec\.ts/,
    grep: /muschioCollectProductUrls$/,
  },
  {
    name: "muschioCollectProducts",
    testMatch: /muschio\.spec\.ts/,
    grep: /muschioCollectProducts$/,
    dependencies: ["muschioCollectProductUrls"],
  },
];

const activeProjects = runOnlyActive
  ? projects.filter((project) => project.testMatch?.test(activeTestFile))
  : projects;

export default defineConfig({
  testDir: "./tests",

  fullyParallel: true,

  reporter: "html",

  timeout: 60 * 60 * 1000,

  use: {
    ...devices["Desktop Chrome"],
  },

  projects: activeProjects,
});
