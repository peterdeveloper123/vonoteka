import { mkdir, writeFile, readFile } from "node:fs/promises";
import { test, expect } from "@playwright/test";

const input = "results/1907perfumeries/productUrls.json";
const output = "results/1907perfumeries/products.json";
const concurrency = 10;

test("getProductUrls", async ({ page }) => {
  test.setTimeout(0);

  await page.goto("https://www.1907perfumeries.sk/", {
    waitUntil: "domcontentloaded",
  });

  const categories = await page
    .locator(".root-eshop-menu > li.sub > a")
    .evaluateAll((els) => els.map((el) => (el as HTMLAnchorElement).href));

  const productUrls: string[] = [];

  for (const [i, url] of categories.entries()) {
    await page.goto(url, { waitUntil: "domcontentloaded" });

    const urls = await page
      .locator(".productTitleContent > a.product-box-link")
      .evaluateAll((els) =>
        els
          .map((el) => (el as HTMLAnchorElement).href)
          .filter((url) => !url.toLowerCase().includes("vzorka")),
      );

    productUrls.push(...urls);
    console.log(`[${i + 1}/${categories.length}] ${urls.length} products`);
  }

  await mkdir("results/1907perfumeries", { recursive: true });
  await writeFile(
    "results/1907perfumeries/productUrls.json",
    JSON.stringify([...new Set(productUrls)], null, 2),
  );
});

test("getProducts", async ({ context }) => {
  test.setTimeout(0);
  const productUrls: string[] = JSON.parse(await readFile(input, "utf8"));
  const products = new Array(productUrls.length);
  let done = 0;
  console.log(`Found ${productUrls.length} product URLs`);
  const workers = Array.from(
    { length: Math.min(concurrency, productUrls.length) },
    async (_, worker) => {
      const page = await context.newPage();

      for (let i = worker; i < productUrls.length; i += concurrency) {
        await page.goto(productUrls[i], { waitUntil: "domcontentloaded" });
        await page.locator("h1").waitFor({ state: "visible" });

        products[i] = await page.evaluate(() => {
          const text = (selector: string) =>
            document.querySelector(selector)?.textContent?.trim() || null;

          const row = (name: string) => {
            const tr = [...document.querySelectorAll("tr")].find((tr) =>
              tr.querySelector("td")?.textContent?.toLowerCase().includes(name),
            );
            return (
              tr?.querySelector("td:nth-child(2)")?.textContent?.trim() || null
            );
          };

          const money = (value: string | null) =>
            value
              ? Number(
                  value.replace(/\s/g, "").replace("€", "").replace(",", "."),
                )
              : null;

          const nazov = text("h1")!;
          const hlavnaKategoria = text(
            ".root-eshop-menu > li.selected-category > a > strong",
          );

          const normalize = (s: string) =>
            s
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .toLowerCase();

          const subs = [
            ...document.querySelectorAll(
              ".root-eshop-menu > li.selected-category > ul.eshop-submenu > li > a > strong",
            ),
          ]
            .map((el) => el.textContent?.trim())
            .filter((x): x is string => !!x)
            .sort((a, b) => b.length - a.length);

          const podkategoria =
            subs.find((sub) => normalize(nazov).includes(normalize(sub))) ||
            null;

          const description = document
            .querySelector(".description-wrapper .spc")
            ?.cloneNode(true) as HTMLElement | undefined;
          description?.querySelector("h3")?.remove();

          return {
            nazov,
            hlavnaKategoria,
            podkategoria,
            jeSkladom: !!document.querySelector(
              ".product-detail-container.in-stock-y",
            ),
            price: money(text(".price-value.def_color")),
            objem: row("objem"),
            koncentracia: row("koncentr"),
            cenaBezDph: money(text(".price-novat")),
            description: description?.innerText.trim() || null,
            jeNovinka: !!document.querySelector(".ico_new"),
          };
        });

        console.log(`[${++done}/${productUrls.length}] ${products[i].nazov}`);
      }

      await page.close();
    },
  );

  await Promise.all(workers);

  await writeFile(output, JSON.stringify(products, null, 2), "utf8");

  const savedProducts = JSON.parse(await readFile(output, "utf8"));

  expect(savedProducts).toHaveLength(productUrls.length);

  console.log(
    `✓ ${savedProducts.length}/${productUrls.length} products saved to ${output}`,
  );
});
