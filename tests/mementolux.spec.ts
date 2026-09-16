import { mkdir, writeFile, readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";

const shopUrl = "https://www.mementolux.sk/kategoria/parfumy/";

const resultsDirectory = "results/mementolux";
const productUrlsFile = `${resultsDirectory}/productUrls.json`;
const productsFile = `${resultsDirectory}/products.json`;

const workerCount = 10;

test("mementoluxCollectProductUrls", async ({ context }) => {
  const initialPage = await context.newPage();

  await initialPage.goto(shopUrl, {
    waitUntil: "domcontentloaded",
  });

  const pageNumbers = await initialPage
    .locator("a.page-number")
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
          pageNumber === 1 ? shopUrl : `${shopUrl}page/${pageNumber}/`;

        await page.goto(pageUrl, {
          waitUntil: "domcontentloaded",
        });

        await page.locator(".products .product-small.col").first().waitFor({
          state: "attached",
        });

        const pageResult = await page
          .locator(".products .product-small.col")
          .evaluateAll((products) => {
            /*
             * Products that we do not want to save
             * as normal perfumes.
             *
             * Variable products containing e.g.
             * 100 ml + 3 ml are NOT removed here,
             * because the product name itself does
             * not contain "vzorka".
             */
            const nonPerfumePattern =
              /(vzorka|sample|discovery|discovery set|vzorkový set|vzorkove sety|gift set|darčeková sada|darceková sada|darčekový box|refill|náplň|napln|cestovné balenie|cestovne balenie|travel size|roll[\s-]?on|vlasový parfém|vlasovy parfem|hair perfume|hair mist|body mist|sviečka|sviecka|candle|difuzér|difuzer|diffuser|interiérová vôňa|interierova vona)/i;

            const urls: string[] = [];

            let skippedCount = 0;

            for (const product of products) {
              const link = product.querySelector(
                ".woocommerce-loop-product__link",
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

test("mementoluxCollectProducts", async ({ context }) => {
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
          const root = document.querySelector(".product.type-product");

          if (!root) {
            return null;
          }

          const summary = root.querySelector(".summary");

          const getText = (selector: string) =>
            summary?.querySelector(selector)?.textContent?.trim() || null;

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
            root.querySelector("h1.product-title")?.textContent?.trim() ||
            document.querySelector("h1")?.textContent?.trim() ||
            null;

          /*
           * BRAND
           *
           * Brand categories use:
           *
           * /kategoria/parfumy/znacky-parfemy/<brand>/
           */
          const brandLink = [...root.querySelectorAll(".product_meta a")].find(
            (element) => {
              const anchor = element as HTMLAnchorElement;

              try {
                const pathname = new URL(anchor.href).pathname;

                return (
                  pathname.startsWith("/kategoria/parfumy/znacky-parfemy/") &&
                  pathname !== "/kategoria/parfumy/znacky-parfemy/"
                );
              } catch {
                return false;
              }
            },
          );

          const brand = brandLink?.textContent?.trim() || null;

          /*
           * DESCRIPTION
           *
           * #tab-description contains the clean
           * actual product description.
           */
          const descriptionElement = document.querySelector("#tab-description");

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
           * VARIABLE PRODUCT
           *
           * WooCommerce stores all information about
           * variants directly in:
           *
           * form.variations_form[data-product_variations]
           */
          const variationsForm = root.querySelector(
            "form.variations_form",
          ) as HTMLFormElement | null;

          type Variation = {
            attributes?: Record<string, string>;
            display_price?: number;
            display_regular_price?: number;
            is_in_stock?: boolean;
            is_purchasable?: boolean;
            variation_is_active?: boolean;
            variation_is_visible?: boolean;
            image?: {
              url?: string;
              full_src?: string;
              src?: string;
              alt?: string;
              title?: string;
            };
          };

          let variations: Variation[] = [];

          if (variationsForm) {
            const rawVariations = variationsForm.getAttribute(
              "data-product_variations",
            );

            if (rawVariations) {
              try {
                variations = JSON.parse(rawVariations);
              } catch {
                variations = [];
              }
            }
          }

          /*
           * IMPORTANT:
           *
           * User wants the most expensive variant.
           *
           * Example Abyat:
           *
           * 100 ml -> €250
           * 3 ml   -> €12
           *
           * Result:
           *
           * 100 ml -> €250
           */
          const selectedVariant =
            variations
              .filter(
                (variation) => typeof variation.display_price === "number",
              )
              .sort(
                (a, b) =>
                  (b.display_price ?? -Infinity) -
                  (a.display_price ?? -Infinity),
              )[0] || null;

          /*
           * VOLUME
           */
          const extractVolume = (value: string) => {
            const normalized = value.replace(/[_-]+/g, " ");

            const match = normalized.match(/(\d+(?:[.,]\d+)?)\s*ml/i);

            if (!match) {
              return null;
            }

            return `${Number(match[1].replace(",", "."))} ml`;
          };

          let volume: string | null = null;

          if (selectedVariant?.attributes) {
            for (const value of Object.values(selectedVariant.attributes)) {
              volume = extractVolume(value);

              if (volume) {
                break;
              }
            }
          }

          /*
           * Simple product or fallback.
           */
          if (!volume) {
            const volumeSource = [
              name || "",
              description,
              summary?.textContent || "",
            ].join(" ");

            volume = extractVolume(volumeSource);
          }

          /*
           * CONCENTRATION
           *
           * Normalize different Slovak /
           * English / French labels into
           * the same values as our other shops.
           */
          const concentrationSource = [
            name || "",
            description,
            summary?.textContent || "",
          ].join(" ");

          let concentration: string | null = null;

          if (
            /(extrait de parfum|parfum extract|perfume extract|extrait)/i.test(
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
           * Keep only products whose perfume
           * concentration can be identified.
           */
          if (!concentration) {
            return null;
          }

          /*
           * PRICE + DISCOUNT + BUYABLE
           */
          let price: number | null = null;

          let isDiscount = false;
          let originalPrice = 0;
          let buyable = false;

          if (selectedVariant) {
            /*
             * Variable product.
             */
            price = selectedVariant.display_price ?? null;

            const regularPrice = selectedVariant.display_regular_price ?? null;

            if (
              regularPrice !== null &&
              price !== null &&
              regularPrice > price
            ) {
              isDiscount = true;
              originalPrice = regularPrice;
            }

            buyable =
              selectedVariant.is_in_stock === true &&
              selectedVariant.is_purchasable === true &&
              selectedVariant.variation_is_active !== false &&
              selectedVariant.variation_is_visible !== false;
          } else {
            /*
             * Simple product.
             */
            const priceElement = summary?.querySelector(".price");

            const salePriceText =
              priceElement
                ?.querySelector("ins .woocommerce-Price-amount")
                ?.textContent?.trim() || null;

            const regularPriceText =
              priceElement
                ?.querySelector("del .woocommerce-Price-amount")
                ?.textContent?.trim() || null;

            const normalPriceText =
              priceElement
                ?.querySelector(".woocommerce-Price-amount")
                ?.textContent?.trim() || null;

            price = parsePrice(salePriceText) ?? parsePrice(normalPriceText);

            const parsedRegularPrice = parsePrice(regularPriceText);

            if (
              parsedRegularPrice !== null &&
              price !== null &&
              parsedRegularPrice > price
            ) {
              isDiscount = true;
              originalPrice = parsedRegularPrice;
            }

            const hasInStockClass = root.classList.contains("instock");

            const hasPurchasableClass = root.classList.contains("purchasable");

            const addToCartButton = summary?.querySelector(
              ".single_add_to_cart_button",
            ) as HTMLButtonElement | null;

            buyable =
              hasInStockClass &&
              hasPurchasableClass &&
              !!addToCartButton &&
              !addToCartButton.disabled;
          }

          /*
           * IMAGE
           *
           * We prefer a standalone perfume bottle.
           *
           * Negative examples:
           * box
           * packaging
           * custodia
           * confezione
           *
           * "custodia" is useful on this shop:
           *
           * profumo-ambra-oud.jpg
           * profumo-ambra-oud-custodia.jpg
           */
          const galleryImages = [
            ...root.querySelectorAll(".woocommerce-product-gallery__image"),
          ]
            .map((element, order) => {
              const anchor = element.querySelector(
                "a[href]",
              ) as HTMLAnchorElement | null;

              const img = element.querySelector(
                "img",
              ) as HTMLImageElement | null;

              if (!anchor) {
                return null;
              }

              let searchableText = [
                anchor.href,
                img?.alt,
                img?.title,
                element.getAttribute("data-thumb-alt"),
              ]
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
               * Positive signals.
               */
              if (
                /(bottle|flacon|flakon|flakón|profumo|parfum|perfume)/i.test(
                  searchableText,
                )
              ) {
                score += 50;
              }

              /*
               * Packaging signals.
               */
              if (
                /(box|package|packaging|balenie|custodia|confezione|coffret|gift[\s_-]?box|set)/i.test(
                  searchableText,
                )
              ) {
                score -= 100;
              }

              /*
               * First gallery image is usually
               * the primary standalone product.
               */
              if (order === 0) {
                score += 20;
              }

              return {
                url: anchor.href,
                score,
                order,
              };
            })
            .filter(
              (
                image,
              ): image is {
                url: string;
                score: number;
                order: number;
              } => image !== null,
            );

          galleryImages.sort((a, b) => b.score - a.score || a.order - b.order);

          const preferredGalleryImage = galleryImages[0]?.url || null;

          /*
           * Variant-specific high-resolution image.
           */
          const variantImage =
            selectedVariant?.image?.full_src ||
            selectedVariant?.image?.url ||
            null;

          /*
           * Main WooCommerce image fallback.
           */
          const mainImage =
            (
              root.querySelector(
                ".woocommerce-product-gallery__image a[href]",
              ) as HTMLAnchorElement | null
            )?.href || null;

          const imageUrl =
            preferredGalleryImage || variantImage || mainImage || null;

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
