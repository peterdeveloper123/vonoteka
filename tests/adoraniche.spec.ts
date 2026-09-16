import { mkdir, writeFile, readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";

const shopUrl = "https://www.adoraniche.sk/parfemy/";

const resultsDirectory = "results/adoraniche";
const productUrlsFile = `${resultsDirectory}/productUrls.json`;
const productsFile = `${resultsDirectory}/products.json`;

const workerCount = 10;

test("adoranicheCollectProductUrls", async ({ context }) => {
  const initialPage = await context.newPage();

  await initialPage.goto(shopUrl, {
    waitUntil: "domcontentloaded",
  });

  const pageNumbers = await initialPage
    .locator("a.pagination__link")
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
    {
      length: pageWorkerCount,
    },
    async (_, workerIndex) => {
      const page = await context.newPage();

      for (
        let pageNumber = workerIndex + 1;
        pageNumber <= lastPage;
        pageNumber += pageWorkerCount
      ) {
        const pageUrl =
          pageNumber === 1 ? shopUrl : `${shopUrl}strana-${pageNumber}/`;

        await page.goto(pageUrl, {
          waitUntil: "domcontentloaded",
        });

        await page.locator(".product a.name").first().waitFor({
          state: "attached",
        });

        const pageResult = await page
          .locator(".product")
          .evaluateAll((products) => {
            /*
             * Ignore products that are clearly
             * not normal full-size perfumes.
             */
            const nonPerfumePattern =
              /(vzorka|sample|discovery|discovery set|vzorkový set|gift set|darčeková sada|refill|náplň|napln|cestovné balenie|cestovne balenie|travel size|roll[\s-]?on|vlasový parfém|vlasovy parfem|hair perfume|hair mist|body mist|telový krém|telovy krem|body cream|parfumovaný sprej|parfumovany sprej)/i;

            const urls: string[] = [];

            let skippedCount = 0;

            for (const product of products) {
              const link = product.querySelector(
                "a.name",
              ) as HTMLAnchorElement | null;

              if (!link) {
                continue;
              }

              const name = link.textContent?.trim() || "";

              const productUrl = link.href;

              if (
                nonPerfumePattern.test(name) ||
                nonPerfumePattern.test(productUrl)
              ) {
                skippedCount++;
                continue;
              }

              urls.push(productUrl);
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

test("adoranicheCollectProducts", async ({ context }) => {
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

        await page.locator(".p-detail").waitFor({
          state: "attached",
        });

        const product = await page.evaluate((productUrl) => {
          const root = document.querySelector(".p-detail");

          if (!root) {
            return null;
          }

          const getText = (selector: string) =>
            root.querySelector(selector)?.textContent?.trim() || null;

          const parsePrice = (value: string | null) => {
            if (!value) {
              return null;
            }

            const normalized = value
              .replace(/\s/g, "")
              .replace(/€/g, "")
              .replace(",", ".")
              .replace(/[^\d.-]/g, "");

            const parsed = Number(normalized);

            return Number.isFinite(parsed) ? parsed : null;
          };

          /*
           * NAME
           */
          const name =
            root.querySelector("h1")?.textContent?.trim() ||
            document.querySelector("h1")?.textContent?.trim() ||
            null;

          /*
           * BRAND
           *
           * Adora Niche exposes the brand
           * as the product category.
           *
           * Example:
           *
           * .category-link a -> "Neydo"
           * .category-link a -> "Baruti"
           * .category-link a -> "Ideo Parfumeurs"
           */
          const brand =
            root.querySelector(".category-link a")?.textContent?.trim() || null;

          /*
           * DESCRIPTION
           *
           * .basic-description contains the actual
           * full description of the perfume.
           */
          const descriptionElement = root.querySelector(".basic-description");

          let description =
            descriptionElement instanceof HTMLElement
              ? descriptionElement.innerText
              : "";

          description = description
            .replace(/\u00a0/g, " ")
            .split("\n")
            .map((line) => line.trim())
            .join("\n")
            .replace(/\n{3,}/g, "\n\n")
            .trim();

          /*
           * VARIANTS
           *
           * The current Adora Niche perfume catalogue
           * does not use variants, but this supports
           * Shoptet variants if they are added later.
           *
           * Rule:
           * ALWAYS select the most expensive variant.
           */
          const variantSelect = root.querySelector(
            "#simple-variants-select",
          ) as HTMLSelectElement | null;

          const variantOptions = variantSelect
            ? [...variantSelect.options]
                .filter((option) => !!option.value)
                .map((option) => {
                  const text = option.textContent?.trim() || "";

                  const price = parsePrice(
                    option.dataset.customerprice || null,
                  );

                  const volumeMatch = text.match(/(\d+(?:[.,]\d+)?)\s*ml/i);

                  const volume = volumeMatch
                    ? `${Number(volumeMatch[1].replace(",", "."))} ml`
                    : null;

                  const unavailable =
                    /(vypredané|vypredane|nedostupné|nedostupne|ukončený predaj|ukonceny predaj|čoskoro skladom)/i.test(
                      text,
                    );

                  const available = /skladom/i.test(text) && !unavailable;

                  /*
                   * Try to detect original price
                   * from variant data.
                   */
                  const originalPriceCandidates = Object.entries(option.dataset)
                    .filter(([key]) =>
                      /(?:original|standard|regular|old|before|list).*price|price.*(?:original|standard|regular|old|before|list)/i.test(
                        key,
                      ),
                    )
                    .map(([, value]) => parsePrice(value || null))
                    .filter(
                      (value): value is number =>
                        value !== null && price !== null && value > price,
                    );

                  const originalPrice =
                    originalPriceCandidates.length > 0
                      ? Math.max(...originalPriceCandidates)
                      : 0;

                  return {
                    price,
                    volume,
                    available,
                    originalPrice,
                    option,
                  };
                })
            : [];

          /*
           * Most expensive variant wins.
           */
          const selectedVariant =
            variantOptions
              .filter((variant) => variant.price !== null)
              .sort(
                (a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity),
              )[0] || null;

          /*
           * PRICE
           */
          const simpleProductPrice = parsePrice(
            getText(".p-final-price-wrapper .price-final-holder") ||
              getText(".p-final-price-wrapper .price-final"),
          );

          const price = selectedVariant?.price ?? simpleProductPrice;

          /*
           * VOLUME
           */
          let volume = selectedVariant?.volume || null;

          if (!volume) {
            const volumeSource = [
              name || "",
              description,
              getText(".p-short-description") || "",
            ].join(" ");

            const volumeMatch = volumeSource.match(/(\d+(?:[.,]\d+)?)\s*ml/i);

            if (volumeMatch) {
              volume = `${Number(volumeMatch[1].replace(",", "."))} ml`;
            }
          }

          /*
           * CONCENTRATION
           *
           * Normalize everything to the same values
           * used by the other perfume scrapers.
           */
          const concentrationSource = [
            name || "",
            description,
            getText(".p-short-description") || "",
          ].join(" ");

          let concentration: string | null = null;

          if (
            /(extrait de parfum|parfum extract|perfume extract|\bextrait\b)/i.test(
              concentrationSource,
            )
          ) {
            concentration = "Extrait de Parfum";
          } else if (
            /(eau de parfum|parfumovan[aá] voda|\bedp\b)/i.test(
              concentrationSource,
            )
          ) {
            concentration = "Eau de Parfum";
          } else if (
            /(eau de toilette|toaletn[aá] voda|\bedt\b)/i.test(
              concentrationSource,
            )
          ) {
            concentration = "Eau de Toilette";
          } else if (
            /(eau de cologne|kol[ií]nska voda|\bedc\b)/i.test(
              concentrationSource,
            )
          ) {
            concentration = "Eau de Cologne";
          } else if (
            /(?:^|[^\p{L}])(parfum|parf[eé]m|perfume)(?:$|[^\p{L}])/iu.test(
              concentrationSource,
            )
          ) {
            concentration = "Parfum";
          }

          /*
           * We only save products for which
           * perfume concentration is identifiable.
           */
          if (!concentration) {
            return null;
          }

          /*
           * BUYABLE
           */
          let buyable = false;

          if (selectedVariant) {
            /*
             * buyable refers specifically to the
             * selected most expensive variant.
             */
            buyable = selectedVariant.available;
          } else {
            const availabilityText = getText(".availability-value") || "";

            const unavailable =
              /(vypredané|vypredane|momentálne nedostupné|momentálne nedostupne|nedostupné|nedostupne|ukončený predaj|ukonceny predaj|čoskoro skladom)/i.test(
                availabilityText,
              );

            const inStock = /skladom/i.test(availabilityText) && !unavailable;

            const addToCartButton = root.querySelector(
              ".add-to-cart-button",
            ) as HTMLButtonElement | null;

            buyable = inStock && !!addToCartButton && !addToCartButton.disabled;
          }

          /*
           * DISCOUNT
           *
           * Shoptet sale products normally use:
           *
           * .price-standard -> old/original price
           * .price-final    -> current price
           */
          let isDiscount = false;
          let originalPrice = 0;

          if (
            selectedVariant &&
            selectedVariant.originalPrice > 0 &&
            price !== null &&
            selectedVariant.originalPrice > price
          ) {
            isDiscount = true;
            originalPrice = selectedVariant.originalPrice;
          } else {
            const pageOriginalPrice = parsePrice(
              getText(".p-final-price-wrapper .price-standard"),
            );

            if (
              pageOriginalPrice !== null &&
              price !== null &&
              pageOriginalPrice > price
            ) {
              isDiscount = true;
              originalPrice = pageOriginalPrice;
            }
          }

          /*
           * IMAGE
           *
           * Prefer a photo that appears to contain
           * the standalone perfume bottle.
           */
          const galleryImages = [
            ...root.querySelectorAll(".p-thumbnails a.p-thumbnail[href]"),
          ] as HTMLAnchorElement[];

          const scoredImages = galleryImages.map((image, order) => {
            const img = image.querySelector("img");

            let searchableText = [image.href, image.title, img?.alt]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            try {
              searchableText = decodeURIComponent(searchableText);
            } catch {
              // Keep original text.
            }

            let score = 0;

            /*
             * Positive signals for a
             * standalone perfume bottle.
             */
            if (
              /(bottle|flacon|flakon|flakón|parfum|perfume)/i.test(
                searchableText,
              )
            ) {
              score += 50;
            }

            /*
             * Penalize packaging.
             */
            if (
              /(box|package|packaging|balenie|krabic|krabi|coffret|carton|gift[\s_-]?box|set)/i.test(
                searchableText,
              )
            ) {
              score -= 100;
            }

            /*
             * On Adora the first highlighted image
             * is the primary product packshot.
             */
            if (image.classList.contains("highlighted")) {
              score += 20;
            }

            return {
              url: image.href,
              score,
              order,
            };
          });

          scoredImages.sort((a, b) => b.score - a.score || a.order - b.order);

          const galleryImage = scoredImages[0]?.url || null;

          /*
           * Variant-specific high-resolution image.
           */
          const variantImage = selectedVariant?.option.dataset.big || null;

          /*
           * Main image fallback.
           */
          const mainImage =
            (
              root.querySelector(
                ".p-main-image[href]",
              ) as HTMLAnchorElement | null
            )?.href || null;

          const imageUrl = variantImage || galleryImage || mainImage || null;

          /*
           * EXACT OUTPUT STRUCTURE
           */
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
            `[${processedCount}/${productUrls.length}] ✓ ${product.name} | ${product.volume} | €${product.price}`,
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
        imageUrl: string | null;
        brand: string | null;
        buyable: boolean;
        price: number | null;
        isDiscount: boolean;
        originalPrice: number;
        volume: string | null;
        concentration: string;
        description: string | null;
      }) =>
        !!product.name &&
        !!product.productUrl &&
        typeof product.buyable === "boolean" &&
        typeof product.isDiscount === "boolean" &&
        typeof product.originalPrice === "number" &&
        !!product.concentration &&
        (product.isDiscount || product.originalPrice === 0),
    ),
  ).toBe(true);

  console.log(`✓ ${perfumeCount} perfumes saved to ${productsFile}`);

  console.log(`✓ ${skippedCount} non-perfume products skipped`);
});
