import { mkdir, writeFile, readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";

const resultsDirectory = "results/1907perfumeries";
const productUrlsFile = `${resultsDirectory}/productUrls.json`;
const productsFile = `${resultsDirectory}/products.json`;

const workerCount = 10;

test("1907perfumeriesCollectProductUrls", async ({ page }) => {
  await page.goto("https://www.1907perfumeries.sk/", {
    waitUntil: "domcontentloaded",
  });

  const categoryUrls = await page
    .locator(".root-eshop-menu > li.sub > a")
    .evaluateAll((elements) =>
      elements.map((element) => (element as HTMLAnchorElement).href),
    );

  const productUrls: string[] = [];

  for (const [categoryIndex, categoryUrl] of categoryUrls.entries()) {
    await page.goto(categoryUrl, {
      waitUntil: "domcontentloaded",
    });

    const categoryProductUrls = await page
      .locator(".productTitleContent > a.product-box-link")
      .evaluateAll((elements) =>
        elements
          .map((element) => (element as HTMLAnchorElement).href)
          .filter((url) => !url.toLowerCase().includes("vzorka")),
      );

    productUrls.push(...categoryProductUrls);

    console.log(
      `[${categoryIndex + 1}/${categoryUrls.length}] ${categoryProductUrls.length} products`,
    );
  }

  const uniqueProductUrls = [...new Set(productUrls)];

  await mkdir(resultsDirectory, {
    recursive: true,
  });

  await writeFile(
    productUrlsFile,
    JSON.stringify(uniqueProductUrls, null, 2),
    "utf8",
  );
});

test("1907perfumeriesCollectProducts", async ({ context }) => {
  const productUrls: string[] = JSON.parse(
    await readFile(productUrlsFile, "utf8"),
  );

  const products = new Array(productUrls.length);

  let processedCount = 0;

  console.log(`Found ${productUrls.length} product URLs`);

  const workers = Array.from(
    {
      length: Math.min(workerCount, productUrls.length),
    },
    async (_, workerIndex) => {
      const page = await context.newPage();

      for (
        let productIndex = workerIndex;
        productIndex < productUrls.length;
        productIndex += workerCount
      ) {
        const productUrl = productUrls[productIndex];

        await page.goto(productUrl, {
          waitUntil: "domcontentloaded",
        });

        await page.locator("h1").waitFor({
          state: "visible",
        });

        await page.locator("#detail_src_magnifying_small").waitFor({
          state: "attached",
        });

        products[productIndex] = await page.evaluate((productUrl) => {
          const getText = (selector: string) =>
            document.querySelector(selector)?.textContent?.trim() || null;

          const getTableValue = (label: string) => {
            const tableRow = [...document.querySelectorAll("tr")].find((row) =>
              row
                .querySelector("td")
                ?.textContent?.toLowerCase()
                .includes(label),
            );

            return (
              tableRow?.querySelector("td:nth-child(2)")?.textContent?.trim() ||
              null
            );
          };

          const parsePrice = (value: string | null) =>
            value
              ? Number(
                  value.replace(/\s/g, "").replace("€", "").replace(",", "."),
                )
              : null;

          const normalizeText = (value: string) =>
            value
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .toLowerCase();

          const name = getText("h1")!;

          const mainCategory = getText(
            ".root-eshop-menu > li.selected-category > a > strong",
          );

          const subcategoryNames = [
            ...document.querySelectorAll(
              ".root-eshop-menu > li.selected-category > ul.eshop-submenu > li > a > strong",
            ),
          ]
            .map((element) => element.textContent?.trim())
            .filter((value): value is string => !!value)
            .sort((a, b) => b.length - a.length);

          const subcategory =
            subcategoryNames.find((subcategoryName) =>
              normalizeText(name).includes(normalizeText(subcategoryName)),
            ) || null;

          const descriptionElement = document
            .querySelector(".description-wrapper .spc")
            ?.cloneNode(true) as HTMLElement | undefined;

          descriptionElement?.querySelector("h3")?.remove();

          const imageElement = document.querySelector(
            "#detail_src_magnifying_small",
          ) as HTMLImageElement | null;

          const imageUrl = imageElement?.src || null;

          return {
            name,
            productUrl,
            imageUrl,
            mainCategory,
            subcategory,
            inStock: !!document.querySelector(
              ".product-detail-container.in-stock-y",
            ),
            price: parsePrice(getText(".price-value.def_color")),
            volume: getTableValue("objem"),
            concentration: getTableValue("koncentr"),
            priceExcludingVat: parsePrice(getText(".price-novat")),
            description: descriptionElement?.innerText.trim() || null,
            isNew: !!document.querySelector(".ico_new"),
          };
        }, productUrl);

        processedCount++;

        console.log(
          `[${processedCount}/${productUrls.length}] ${products[productIndex].name}`,
        );
      }

      await page.close();
    },
  );

  await Promise.all(workers);

  await writeFile(productsFile, JSON.stringify(products, null, 2), "utf8");

  const savedProducts = JSON.parse(await readFile(productsFile, "utf8"));

  expect(savedProducts).toHaveLength(productUrls.length);

  console.log(
    `✓ ${savedProducts.length}/${productUrls.length} products saved to ${productsFile}`,
  );
});
