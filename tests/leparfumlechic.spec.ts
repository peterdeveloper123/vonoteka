import { mkdir, writeFile, readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";

const shopUrl = "https://www.leparfumlechic.sk/obchod/";

const resultsDirectory = "results/leparfumlechic";
const productUrlsFile = `${resultsDirectory}/productUrls.json`;
const productsFile = `${resultsDirectory}/products.json`;

const workerCount = 10;

test("leparfumlechicCollectProductUrls", async ({ context }) => {
  const initialPage = await context.newPage();

  await initialPage.goto(shopUrl, {
    waitUntil: "domcontentloaded",
  });

  const pageNumbers = await initialPage
    .locator("a.page-numbers")
    .evaluateAll((elements) =>
      elements
        .map((element) => Number(element.textContent?.trim()))
        .filter((value) => Number.isFinite(value)),
    );

  const lastPage = Math.max(1, ...pageNumbers);

  await initialPage.close();

  console.log(`Found ${lastPage} shop pages`);

  const productUrls: string[] = [];

  let processedPageCount = 0;

  const pageWorkerCount = Math.min(workerCount, lastPage);

  const workers = Array.from(
    { length: pageWorkerCount },
    async (_, workerIndex) => {
      const page = await context.newPage();

      for (
        let pageNumber = workerIndex + 1;
        pageNumber <= lastPage;
        pageNumber += pageWorkerCount
      ) {
        const pageUrl =
          pageNumber === 1 ? shopUrl : `${shopUrl}page/${pageNumber}/`;

        await page.goto(pageUrl, {
          waitUntil: "domcontentloaded",
        });

        await page.locator(".product-item-wrap.product").first().waitFor({
          state: "attached",
        });

        const pageResult = await page
          .locator(".product-item-wrap.product")
          .evaluateAll((products) => {
            const nonPerfumePattern =
              /(body lotion|telový krém|body cream|shower gel|sprchový gél|body wash|sviečka|candle|diffuser|difuzér|soap|mydlo|deodorant|hand cream|krém na ruky|body oil|telový olej|room spray|home fragrance|hair mist|hair perfume|parfum na vlasy|aftershave|balm|balzam|vzorka|sample|discovery set|gift set|darčeková sada|travel set|cestovné balenie|refill|náplň)/i;

            const urls: string[] = [];

            let skippedCount = 0;

            for (const product of products) {
              const link = product.querySelector(
                ".product-name a.gsf-link",
              ) as HTMLAnchorElement | null;

              if (!link) {
                continue;
              }

              const name = link.textContent?.trim() || "";

              if (nonPerfumePattern.test(name)) {
                skippedCount++;
                continue;
              }

              urls.push(link.href);
            }

            return {
              urls,
              totalCount: products.length,
              skippedCount,
            };
          });

        productUrls.push(...pageResult.urls);

        processedPageCount++;

        console.log(
          `[${processedPageCount}/${lastPage}] page ${pageNumber}: ${pageResult.urls.length}/${pageResult.totalCount} candidates, ${pageResult.skippedCount} skipped`,
        );
      }

      await page.close();
    },
  );

  await Promise.all(workers);

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
    `✓ ${uniqueProductUrls.length} candidate product URLs saved to ${productUrlsFile}`,
  );
});

test("leparfumlechicCollectProducts", async ({ context }) => {
  const productUrls: string[] = JSON.parse(
    await readFile(productUrlsFile, "utf8"),
  );

  const products = new Array(productUrls.length).fill(null);

  let processedCount = 0;
  let perfumeCount = 0;
  let skippedCount = 0;

  console.log(`Found ${productUrls.length} candidate product URLs`);

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

        await page.locator(".product.type-product").first().waitFor({
          state: "attached",
        });

        const product = await page.evaluate((productUrl) => {
          const getText = (selector: string) =>
            document.querySelector(selector)?.textContent?.trim() || null;

          const parsePrice = (value: string | null) => {
            if (!value) {
              return null;
            }

            const normalized = value
              .replace(/\s/g, "")
              .replace("€", "")
              .replace(",", ".");

            const parsed = Number(normalized);

            return Number.isFinite(parsed) ? parsed : null;
          };

          const getProductJsonLd = () => {
            const scripts = [
              ...document.querySelectorAll(
                'script[type="application/ld+json"]',
              ),
            ];

            const findProduct = (value: any): any | null => {
              if (!value) {
                return null;
              }

              if (Array.isArray(value)) {
                for (const item of value) {
                  const product = findProduct(item);

                  if (product) {
                    return product;
                  }
                }

                return null;
              }

              if (typeof value !== "object") {
                return null;
              }

              const type = value["@type"];

              if (
                type === "Product" ||
                (Array.isArray(type) && type.includes("Product"))
              ) {
                return value;
              }

              if (value["@graph"]) {
                return findProduct(value["@graph"]);
              }

              return null;
            };

            for (const script of scripts) {
              try {
                const parsed = JSON.parse(script.textContent || "");

                const product = findProduct(parsed);

                if (product) {
                  return product;
                }
              } catch {
                // Invalid JSON-LD.
              }
            }

            return null;
          };

          const productData = getProductJsonLd();

          const name = productData?.name || getText("h1") || null;

          const description =
            productData?.description?.trim() ||
            getText(".woocommerce-product-details__short-description") ||
            "";

          /*
           * Remove products that are clearly not perfumes.
           */
          const nonPerfumePattern =
            /(body lotion|telový krém|body cream|shower gel|sprchový gél|body wash|sviečka|candle|diffuser|difuzér|soap|mydlo|deodorant|hand cream|krém na ruky|body oil|telový olej|room spray|home fragrance|hair mist|hair perfume|parfum na vlasy|aftershave|balm|balzam|vzorka|sample|discovery set|gift set|darčeková sada|travel set|cestovné balenie|refill|náplň)/i;

          if (
            nonPerfumePattern.test(`${name || ""} ${description.slice(0, 300)}`)
          ) {
            return null;
          }

          /*
           * Volume
           */
          const volumeMatch = description.match(/(\d+(?:[.,]\d+)?)\s*ml/iu);

          const volumeNumber = volumeMatch
            ? Number(volumeMatch[1].replace(",", "."))
            : null;

          const volume = volumeNumber !== null ? `${volumeNumber} ml` : null;

          /*
           * Concentration
           */
          let concentration: string | null = null;

          if (/extrait de parfum/iu.test(description)) {
            concentration = "Extrait de Parfum";
          } else if (/eau de parfum/iu.test(description)) {
            concentration = "Eau de Parfum";
          } else if (/eau de toilette/iu.test(description)) {
            concentration = "Eau de Toilette";
          } else if (/eau de cologne/iu.test(description)) {
            concentration = "Eau de Cologne";
          } else {
            const standaloneParfum = /(?:^|[^\p{L}])parfum(?:$|[^\p{L}])/iu;

            if (standaloneParfum.test(description)) {
              concentration = "Parfum";
            }
          }

          if (!concentration) {
            return null;
          }

          /*
           * Brand
           */
          const brand =
            document
              .querySelector(".product_meta .tagged_as a")
              ?.textContent?.trim() || null;

          /*
           * Current price
           *
           * JSON-LD contains the current price.
           * When the product is discounted, this is
           * already the discounted price.
           */
          const offers = productData?.offers;

          const offer = Array.isArray(offers) ? offers[0] : offers;

          const rawPrice = offer?.price;

          const parsedPrice =
            rawPrice !== undefined && rawPrice !== null
              ? Number(String(rawPrice).replace(",", "."))
              : null;

          const price =
            parsedPrice !== null && Number.isFinite(parsedPrice)
              ? parsedPrice
              : null;

          /*
           * Discount
           *
           * Example:
           *
           * <p class="price">
           *   <del>290,00 €</del>
           *   <ins>261,00 €</ins>
           * </p>
           */
          const productPriceElement =
            document.querySelector(".summary-product.entry-summary p.price") ||
            document.querySelector(".summary-product .price") ||
            document.querySelector("p.price");

          const originalPriceText =
            productPriceElement
              ?.querySelector("del .woocommerce-Price-amount")
              ?.textContent?.trim() ||
            productPriceElement?.querySelector("del")?.textContent?.trim() ||
            null;

          const salePriceText =
            productPriceElement
              ?.querySelector("ins .woocommerce-Price-amount")
              ?.textContent?.trim() ||
            productPriceElement?.querySelector("ins")?.textContent?.trim() ||
            null;

          const productElement = document.querySelector(
            ".product.type-product",
          );

          const hasSaleClass =
            productElement?.classList.contains("sale") || false;

          const hasSalePrice =
            originalPriceText !== null && salePriceText !== null;

          const isDiscount = hasSaleClass || hasSalePrice;

          const parsedOriginalPrice = parsePrice(originalPriceText);

          const originalPrice =
            isDiscount && parsedOriginalPrice !== null
              ? parsedOriginalPrice
              : 0;

          /*
           * Buyable
           */
          const hasPurchasableClass =
            productElement?.classList.contains("purchasable") || false;

          const hasInStockClass =
            productElement?.classList.contains("instock") || false;

          const availability = String(offer?.availability || "");

          const jsonLdInStock = /\/InStock$/i.test(availability);

          const addToCartButton = document.querySelector(
            "form.cart .single_add_to_cart_button:not([disabled])",
          );

          const buyable = productElement
            ? Boolean(
                addToCartButton || (hasPurchasableClass && hasInStockClass),
              )
            : jsonLdInStock;

          /*
           * Image
           *
           * Priority:
           *
           * 1. Gallery image explicitly describing a bottle.
           * 2. First gallery image.
           * 3. Main high-resolution image.
           * 4. Main displayed image.
           * 5. JSON-LD image.
           */
          const galleryImages = [
            ...document.querySelectorAll("a.woocommerce-thumbnail-image"),
          ] as HTMLAnchorElement[];

          const scoredGalleryImages = galleryImages.map((image, order) => {
            const img = image.querySelector("img");

            let searchableText = [image.href, image.title, img?.alt]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            try {
              searchableText = decodeURIComponent(searchableText);
            } catch {
              // Keep original string.
            }

            let score = 0;

            if (/(bottle|flacon|flakon|flakón)/i.test(searchableText)) {
              score += 100;
            }

            if (
              /(box|package|packaging|balenie|coffret|carton|gift[\s_-]?box)/i.test(
                searchableText,
              )
            ) {
              score -= 150;
            }

            if (image.dataset.index === "0") {
              score += 20;
            }

            return {
              url: image.href,
              score,
              order,
            };
          });

          scoredGalleryImages.sort(
            (a, b) => b.score - a.score || a.order - b.order,
          );

          const preferredGalleryImage = scoredGalleryImages[0]?.url || null;

          const zoomImage =
            (
              document.querySelector(
                ".single-product-image-main a.zoom-image[href]",
              ) as HTMLAnchorElement | null
            )?.href || null;

          const mainImage =
            (
              document.querySelector(
                ".single-product-image-main img",
              ) as HTMLImageElement | null
            )?.src || null;

          const getJsonLdImage = (image: any): string | null => {
            if (!image) {
              return null;
            }

            if (typeof image === "string") {
              return image;
            }

            if (Array.isArray(image)) {
              const firstImage = image[0];

              if (typeof firstImage === "string") {
                return firstImage;
              }

              return firstImage?.url || firstImage?.contentUrl || null;
            }

            return image.url || image.contentUrl || null;
          };

          const jsonLdImage = getJsonLdImage(productData?.image);

          const imageUrl =
            preferredGalleryImage ||
            zoomImage ||
            mainImage ||
            jsonLdImage ||
            null;

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
            description: description || null,
          };
        }, productUrl);

        processedCount++;

        if (product) {
          products[productIndex] = product;

          perfumeCount++;

          console.log(
            `[${processedCount}/${productUrls.length}] ✓ ${product.name}`,
          );
        } else {
          skippedCount++;

          console.log(
            `[${processedCount}/${productUrls.length}] SKIP ${productUrl}`,
          );
        }
      }

      await page.close();
    },
  );

  await Promise.all(workers);

  const filteredProducts = products.filter((product) => product !== null);

  await mkdir(resultsDirectory, {
    recursive: true,
  });

  await writeFile(
    productsFile,
    JSON.stringify(filteredProducts, null, 2),
    "utf8",
  );

  const savedProducts = JSON.parse(await readFile(productsFile, "utf8"));

  expect(savedProducts).toHaveLength(filteredProducts.length);

  expect(savedProducts.length).toBeGreaterThan(0);

  expect(
    savedProducts.every(
      (product: {
        name: string;
        productUrl: string;
        buyable: boolean;
        concentration: string;
        isDiscount: boolean;
        originalPrice: number;
      }) =>
        !!product.name &&
        !!product.productUrl &&
        typeof product.buyable === "boolean" &&
        !!product.concentration &&
        typeof product.isDiscount === "boolean" &&
        typeof product.originalPrice === "number" &&
        (product.isDiscount || product.originalPrice === 0),
    ),
  ).toBe(true);

  console.log(`✓ ${perfumeCount} perfumes saved to ${productsFile}`);

  console.log(`✓ ${skippedCount} non-perfume products skipped`);
});
