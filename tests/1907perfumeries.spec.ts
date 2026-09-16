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

  console.log(
    `✓ ${uniqueProductUrls.length} product URLs saved to ${productUrlsFile}`,
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

          const parsePrice = (value: string | null) => {
            if (!value) {
              return null;
            }

            const normalized = value
              .replace(/\s/g, "")
              .replace("€", "")
              .replace(",", ".")
              .replace(/[^\d.-]/g, "");

            const parsed = Number(normalized);

            return Number.isFinite(parsed) ? parsed : null;
          };

          /*
           * Name
           */
          const name = getText("h1");

          /*
           * Brand
           *
           * The main shop categories mostly correspond
           * directly to brands.
           *
           * "1907 Fragment" and
           * "1907 Beneath the Surface"
           * are collections of the 1907 brand.
           */
          const mainCategory = getText(
            ".root-eshop-menu > li.selected-category > a > strong",
          );

          const brand = mainCategory?.startsWith("1907 ")
            ? "1907"
            : mainCategory;

          /*
           * Image
           */
          const imageElement = document.querySelector(
            "#detail_src_magnifying_small",
          ) as HTMLImageElement | null;

          const imageUrl = imageElement?.src || null;

          /*
           * Buyable
           *
           * In-stock product:
           * .product-detail-container.in-stock-y
           *
           * Out-of-stock product:
           * .product-detail-container.in-stock-n
           */
          const productContainer = document.querySelector(
            ".product-detail-container",
          );

          const isInStock =
            productContainer?.classList.contains("in-stock-y") || false;

          const buyButton = document.querySelector(
            ".product-cart-btn.buy-button-action",
          ) as HTMLInputElement | HTMLButtonElement | null;

          const buyable = isInStock && (!buyButton || !buyButton.disabled);

          /*
           * Current price
           */
          const price = parsePrice(getText(".price-value.def_color"));

          /*
           * Discount / original price
           *
           * Default:
           *
           * isDiscount: false
           * originalPrice: 0
           *
           * If the shop displays an old crossed-out
           * price greater than the current price,
           * it becomes originalPrice.
           */
          const originalPriceSelectors = [
            ".product-detail-container del",
            ".product-detail-container s",
            ".product-detail-container .old-price",
            ".product-detail-container .price-old",
            ".product-detail-container .original-price",
            ".product-detail-container .price-original",
            ".product-detail-container .price-before",
            ".product-detail-container .price-before-discount",
          ];

          const originalPriceCandidates = originalPriceSelectors
            .flatMap((selector) =>
              [...document.querySelectorAll(selector)].map((element) =>
                parsePrice(element.textContent?.trim() || null),
              ),
            )
            .filter(
              (value): value is number =>
                value !== null && price !== null && value > price,
            );

          /*
           * Also inspect hidden fields in case the shop
           * stores the original price there.
           */
          const hiddenOriginalPriceCandidates = [
            ...document.querySelectorAll(
              [
                'input[name*="povod"]',
                'input[name*="original"]',
                'input[name*="old"]',
                'input[name*="before"]',
              ].join(","),
            ),
          ]
            .map((element) =>
              parsePrice((element as HTMLInputElement).value || null),
            )
            .filter(
              (value): value is number =>
                value !== null && price !== null && value > price,
            );

          const possibleOriginalPrices = [
            ...originalPriceCandidates,
            ...hiddenOriginalPriceCandidates,
          ];

          const detectedOriginalPrice =
            possibleOriginalPrices.length > 0
              ? Math.min(...possibleOriginalPrices)
              : null;

          const isDiscount = detectedOriginalPrice !== null;

          const originalPrice = detectedOriginalPrice ?? 0;

          /*
           * Volume / concentration
           */
          const rawVolume = getTableValue("objem");

          const volumeMatch = rawVolume?.match(/(\d+(?:[.,]\d+)?)\s*ml/i);

          const volume = volumeMatch
            ? `${Number(volumeMatch[1].replace(",", "."))} ml`
            : rawVolume;

          const rawConcentration = getTableValue("koncentr");

          let concentration = rawConcentration;

          if (rawConcentration) {
            if (/extrait de parfum/i.test(rawConcentration)) {
              concentration = "Extrait de Parfum";
            } else if (/eau de parfum/i.test(rawConcentration)) {
              concentration = "Eau de Parfum";
            } else if (/eau de toilette/i.test(rawConcentration)) {
              concentration = "Eau de Toilette";
            } else if (/eau de cologne/i.test(rawConcentration)) {
              concentration = "Eau de Cologne";
            } else if (/parfum/i.test(rawConcentration)) {
              concentration = "Parfum";
            }
          }

          /*
           * Description
           */
          const descriptionElement = document
            .querySelector(".description-wrapper .spc")
            ?.cloneNode(true) as HTMLElement | undefined;

          descriptionElement?.querySelector("h3")?.remove();

          const description = descriptionElement?.innerText.trim() || null;

          return {
            name,
            productUrl,
            imageUrl,
            brand,
            buyable,
            price,
            isDiscount,
            originalPrice,
            volume,
            concentration,
            description,
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

  expect(
    savedProducts.every(
      (product: {
        name: string;
        productUrl: string;
        buyable: boolean;
        isDiscount: boolean;
        originalPrice: number;
      }) =>
        !!product.name &&
        !!product.productUrl &&
        typeof product.buyable === "boolean" &&
        typeof product.isDiscount === "boolean" &&
        typeof product.originalPrice === "number" &&
        (product.isDiscount || product.originalPrice === 0),
    ),
  ).toBe(true);

  console.log(
    `✓ ${savedProducts.length}/${productUrls.length} products saved to ${productsFile}`,
  );
});
