import type { Page } from 'puppeteer';
import puppeteer from 'puppeteer';
import {
  COLLECTION_PRODUCT_SELECTOR,
  LOGGING_PREFIX,
  PATH_PRODUCT_JSON,
  PATH_SKU_JSON,
  PRODUCT_DETAIL_SELECTOR,
  SKU_SELECTOR,
} from './constants';
import type { Product, ProductInfoJSON, Sku, SkuJSON } from './types';
import { generateUniqueId, readDataFromJsonFile, saveDataToJsonFile, urlValidation } from './utils';

const PRODUCT_CACHED = readDataFromJsonFile<ProductInfoJSON>(PATH_PRODUCT_JSON) || {};
const SKU_CACHED = readDataFromJsonFile<SkuJSON>(PATH_SKU_JSON) || {};

export async function crawlCollection(url: string) {
  if (!urlValidation(url)) return;

  logging.info(LOGGING_PREFIX, 'Website url:', url);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  logging.info(LOGGING_PREFIX, 'Collection ...');

  try {
    const productLinkList = await page.$$eval(
      COLLECTION_PRODUCT_SELECTOR.ITEM,
      (elements, selector) =>
        elements.map((element) => {
          const buttons = element.querySelectorAll<HTMLButtonElement>(selector.ITEM_BUTTON);
          return Array.from(buttons).map((button) => {
            button.click();
            return element.querySelector<HTMLAnchorElement>(selector.ITEM_LINK)?.href.trim() ?? '';
          });
        }),
      COLLECTION_PRODUCT_SELECTOR,
    );

    const maxProductLength = productLinkList.length;
    let productCount = 0;

    logging.info(LOGGING_PREFIX, 'Product total:', maxProductLength);

    for (const productVariantLinks of productLinkList) {
      const product = await crawlWebsiteProduct(productVariantLinks, page);
      if (product) {
        logging.info(LOGGING_PREFIX, `created ${product.name}`, '| process:', ++productCount);
      }
    }
  } catch (error) {
    logging.danger(LOGGING_PREFIX, 'Error crawling website:', error);
  } finally {
    // Close the page and browser
    logging.info(LOGGING_PREFIX, 'Closing page and browser ...');
    await page.close();
    await browser.close();
    logging.info(LOGGING_PREFIX, 'Page closed and browser closed');
    logging.info(LOGGING_PREFIX, 'Collection finished');
  }
}
async function crawlWebsiteProduct(hrefList: string[], page: Page): Promise<Product | undefined> {
  if (hrefList.length === 0) {
    logging.info(LOGGING_PREFIX, 'No link found');
    return;
  }

  const hrefLength = hrefList.length;
  let productId: string | null = null;
  let currentProcess = 0;

  for (const href of hrefList) {
    if (!urlValidation(href)) {
      logging.info(LOGGING_PREFIX, `[Invalid URL]: \n${href}`);
      continue;
    }
    const url = new URL(href);
    const skuCached = SKU_CACHED[href];
    if (SKU_CACHED[href]) {
      productId = skuCached[0].productId ?? null;
      logging.info(LOGGING_PREFIX, `[Already sku]: ${url.pathname}`);
      continue;
    }

    logging.info(LOGGING_PREFIX, url.pathname);
    await page.goto(href);

    if (productId === null) {
      productId = generateUniqueId();
    }

    const skus = await crawlProductSkuRaw(productId, page);

    // Save to JSON
    SKU_CACHED[href] = skus;
    saveDataToJsonFile(PATH_SKU_JSON, SKU_CACHED);

    currentProcess++;

    logging.info(LOGGING_PREFIX, `[${productId}] ${currentProcess}/${hrefLength}`);
  }

  if (productId === null) {
    logging.danger(LOGGING_PREFIX, 'something went wrong', hrefList);
    return;
  }

  let product = PRODUCT_CACHED[productId];
  if (product) {
    logging.info(LOGGING_PREFIX, 'Product [name]:', product.name, '[id]:', productId, '(cached)');
    return;
  }

  const [href] = hrefList;
  if (href === undefined) {
    logging.info(LOGGING_PREFIX, 'Href list is empty');
    return;
  }

  await page.goto(href);
  product = await crawlProductRaw(page);
  product.skuIds = hrefList;

  // Save to JSON
  PRODUCT_CACHED[productId] = product;
  saveDataToJsonFile(PATH_PRODUCT_JSON, PRODUCT_CACHED);

  return product;
}

async function crawlProductRaw(page: Page): Promise<Product> {
  return page.$eval(
    PRODUCT_DETAIL_SELECTOR.ROOT,
    (root, selector) => {
      const [, , category] = root.querySelectorAll(selector.CATEGORY);
      const REGEX_REMOVE_ATTRIBUTE_CLASS = /\s*class="[^"]*"/g;
      const REGEX_REMOVE_SCROLL_ELEMENT =
        /<div[^>]*data-testid="size-chart-scrollbar"[^>]*role="scrollbar"[^>]*>[\s\S]*?<\/div><\/div>/g;

      return {
        category: category?.textContent?.trim() ?? 'Sandals',
        name: root.querySelector(selector.NAME)?.textContent?.trim() ?? '',
        shortDescription: root.querySelector(selector.SHORT_DESCRIPTION)?.textContent?.trim() ?? '',
        skuIds: [],
        options: [
          {
            key: 'color',
            type: 'select_with_image',
          },
          {
            key: 'size',
            type: 'select',
          },
        ],
        attrs: Array.from(root.querySelectorAll(selector.SPECIFICATION)).map((el) => ({
          key: el.querySelector(selector.SPECIFICATION_KEY)?.textContent?.trim() ?? '',
          value:
            el
              .querySelector(selector.SPECIFICATION_VALUE)
              ?.innerHTML.trim()
              .replace(REGEX_REMOVE_ATTRIBUTE_CLASS, '')
              .replace(REGEX_REMOVE_SCROLL_ELEMENT, '') ?? '',
        })),
      };
    },
    PRODUCT_DETAIL_SELECTOR,
  );
}

async function crawlProductSkuRaw(productId: string, page: Page): Promise<Sku[]> {
  return page.$eval(
    SKU_SELECTOR.ROOT,
    (root, selector, id) => {
      const leftSideEl = root.querySelector(selector.LEFT_SIDE)!;
      const asideEl = root.querySelector(selector.ASIDE)!;

      const images = Array.from(leftSideEl.querySelectorAll(selector.IMAGE))
        .map((el) => el.getAttribute('src')?.trim() ?? '')
        .slice(0, 4);

      const [firstPrice, lastPrice] = Array.from(asideEl.querySelectorAll(selector.PRICE)).map(
        (el) => el.textContent?.trim() ?? '',
      );

      const productSizes = Array.from(asideEl.querySelectorAll(selector.SIZE_LIST)).map(
        (el) => el.textContent?.trim() ?? '',
      );

      const productColor = asideEl.querySelector(selector.COLOR)!;
      const productColorName = productColor?.ariaLabel?.replace(/^Select color /, '').trim() ?? '';

      let price = parseFloat(lastPrice?.replace('$', ''));
      const discountPrice = parseFloat(firstPrice.replace('$', ''));

      if (lastPrice === undefined) {
        price = discountPrice;
      }

      return productSizes.map((size) => ({
        productId: id,
        price,
        discountPrice,
        stock: 1,
        images,
        specs: [
          {
            key: 'color',
            value: productColorName,
          },
          {
            key: 'size',
            value: size,
          },
        ],
      }));
    },
    SKU_SELECTOR,
    productId,
  );
}
