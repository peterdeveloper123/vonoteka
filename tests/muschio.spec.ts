import { mkdir, writeFile, readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";

const shopUrl = "https://www.muschio.sk/perfume/";

const resultsDirectory = "results/muschio";
const productUrlsFile = `${resultsDirectory}/productUrls.json`;
const productsFile = `${resultsDirectory}/products.json`;

const workerCount = 10;

test("muschioCollectProductUrls", async ({ context }) => {
  const initialPage = await context.newPage();

  await initialPage.goto(shopUrl, {
    waitUntil: "domcontentloaded",
  });

  const lastPage = await initialPage.evaluate(() => {
    const lastPageLink = document.querySelector(
      ".pagination__link--last",
    ) as HTMLAnchorElement | null;

    const match = lastPageLink?.href.match(/strana-(\d+)/);

    if (match) {
      return Number(match[1]);
    }

    const pageNumbers = [...document.querySelectorAll(".pagination a")]
      .map((element) => Number(element.textContent?.trim()))
      .filter((value) => Number.isFinite(value));

    return Math.max(1, ...pageNumbers);
  });

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

        await page.locator(".product").first().waitFor({
          state: "attached",
        });

        const pageResult = await page
          .locator(".product")
          .evaluateAll((products) => {
            const nonPerfumePattern =
              /(vzorka|sample|discovery|discovery set|coffret|darčeková sada|gift set|refill|náplň|sviečka|candle|diffuser|difuzér|room spray|interiérový sprej|prací gél|praci gel|soap|mydlo|shower gel|sprchový gél|body lotion|telové mlieko|body cream|telový krém|hand cream|krém na ruky|hair mist|body mist|parfum na vlasy)/i;

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
                /vzorka|sample/i.test(productUrl)
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

test("muschioCollectProducts", async ({ context }) => {
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
            document.querySelector("h1")?.textContent?.trim() || null;

          /*
           * BRAND
           */
          const brandLink = [
            ...root.querySelectorAll('a[href*="/znacka/"]'),
          ].find((element) =>
            element.textContent?.trim().startsWith("Značka:"),
          );

          const brand =
            brandLink?.textContent?.trim().replace(/^Značka:\s*/i, "") || null;

          /*
           * DESCRIPTION
           *
           * Use real product description.
           * Preserve paragraphs / new lines.
           */
          const descriptionElement =
            root.querySelector(".basic-description") ||
            root.querySelector(".description-inner");

          let description =
            descriptionElement instanceof HTMLElement
              ? descriptionElement.innerText
              : "";

          /*
           * Remove generic heading.
           */
          description = description.replace(/^Detailný popis produktu\s*/i, "");

          /*
           * Remove generic Muschio content
           * after the actual product description.
           */
          const descriptionStopMarkers = [
            "VZORKU SI MÔŽETE OBJEDNAŤ TU",
            "Čo je to niche parfum?",
            "Neviete si vybrať?",
            "Parametre produktu",
            "Kategórie produktu",
          ];

          let firstStopIndex = -1;

          for (const marker of descriptionStopMarkers) {
            const index = description.indexOf(marker);

            if (
              index !== -1 &&
              (firstStopIndex === -1 || index < firstStopIndex)
            ) {
              firstStopIndex = index;
            }
          }

          if (firstStopIndex !== -1) {
            description = description.slice(0, firstStopIndex);
          }

          /*
           * Clean whitespace but preserve paragraphs.
           */
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
           * If multiple variants exist,
           * store the MOST EXPENSIVE variant.
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
                    /(vypredané|nedostupné|ukončený predaj|čoskoro skladom)/i.test(
                      text,
                    );

                  const available = /skladom/i.test(text) && !unavailable;

                  return {
                    price,
                    volume,
                    available,
                    option,
                  };
                })
            : [];

          /*
           * Highest-priced variant wins.
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
            const volumeSource = [name || "", description].join(" ");

            const volumeMatch = volumeSource.match(/(\d+(?:[.,]\d+)?)\s*ml/i);

            if (volumeMatch) {
              volume = `${Number(volumeMatch[1].replace(",", "."))} ml`;
            }
          }

          /*
           * CONCENTRATION
           */
          const concentrationSource = [name || "", description].join(" ");

          let concentration: string | null = null;

          if (
            /\b(extrait de parfum|extdp|extrait)\b/i.test(concentrationSource)
          ) {
            concentration = "Extrait de Parfum";
          } else if (/\b(eau de parfum|edp)\b/i.test(concentrationSource)) {
            concentration = "Eau de Parfum";
          } else if (/\b(eau de toilette|edt)\b/i.test(concentrationSource)) {
            concentration = "Eau de Toilette";
          } else if (/\b(eau de cologne|edc)\b/i.test(concentrationSource)) {
            concentration = "Eau de Cologne";
          } else if (
            /(?:^|[^\p{L}])parfum(?:$|[^\p{L}])/iu.test(concentrationSource)
          ) {
            concentration = "Parfum";
          }

          /*
           * Skip products where perfume
           * concentration cannot be determined.
           */
          if (!concentration) {
            return null;
          }

          /*
           * BUYABLE
           *
           * Refers to the selected
           * highest-priced variant.
           */
          let buyable = false;

          if (selectedVariant) {
            buyable = selectedVariant.available;
          } else {
            const availabilityText = getText(".availability-value") || "";

            const unavailable =
              /(momentálne nedostupné|vypredané|ukončený predaj|čoskoro skladom)/i.test(
                availabilityText,
              );

            const available = /skladom/i.test(availabilityText) && !unavailable;

            const button = root.querySelector(
              ".add-to-cart-button",
            ) as HTMLButtonElement | null;

            buyable = available && !!button && !button.disabled;
          }

          /*
           * DISCOUNT
           */
          const pageOriginalPrice = parsePrice(
            getText(".p-final-price-wrapper .price-standard"),
          );

          const isDiscount =
            pageOriginalPrice !== null &&
            price !== null &&
            pageOriginalPrice > price;

          const originalPrice =
            isDiscount && pageOriginalPrice !== null ? pageOriginalPrice : 0;

          /*
           * IMAGE
           *
           * First try exact selected
           * variant image.
           */
          const variantImage = selectedVariant?.option.dataset.big || null;

          /*
           * Gallery fallback.
           *
           * Prefer bottle/flacon image,
           * penalize packaging.
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
              // Ignore.
            }

            let score = 0;

            if (
              /(bottle|flacon|flakon|flakón|parfum|perfume)/i.test(
                searchableText,
              )
            ) {
              score += 50;
            }

            if (
              /(box|package|packaging|balenie|coffret|gift[\s_-]?box|set)/i.test(
                searchableText,
              )
            ) {
              score -= 100;
            }

            if (image.classList.contains("highlighted")) {
              score += 10;
            }

            return {
              url: image.href,
              score,
              order,
            };
          });

          scoredImages.sort((a, b) => b.score - a.score || a.order - b.order);

          const galleryImage = scoredImages[0]?.url || null;

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
