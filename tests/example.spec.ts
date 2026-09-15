import { test, expect } from "@playwright/test";

test("get parfumes", async ({ page }) => {
  await page.goto("https://www.1907perfumeries.sk/");

  const categories = page.locator(".root-eshop-menu > li > a > strong");

  await categories.first().waitFor({ state: "visible" });

  const names = await categories.allTextContents();

  console.log(names.map((name) => name.trim()));
});
