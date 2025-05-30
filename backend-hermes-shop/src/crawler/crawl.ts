import type { Page } from 'puppeteer';
import puppeteer from 'puppeteer';
import {
  COLLECTION_PRODUCT_SELECTOR,
  LOGGING_PREFIX,
  PATH_PRODUCT_JSON,
  PATH_VARIANT_JSON,
  PRODUCT_DETAIL_SELECTOR,
  PRODUCT_VARIANT_SELECTOR,
} from './constants';
import type { Product, ProductJSON, ProductVariant, ProductVariantJSON } from './types';
import { generateUniqueId, readDataFromJsonFile, saveDataToJsonFile, urlValidation } from './utils';

const PRODUCT_CACHED = readDataFromJsonFile<ProductJSON>(PATH_PRODUCT_JSON) || {};
const PRODUCT_VARIANT_CACHED = readDataFromJsonFile<ProductVariantJSON>(PATH_VARIANT_JSON) || {};

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
        logging.info(LOGGING_PREFIX, `created ${product.name}`, '| process:', `${++productCount}/${maxProductLength}`);
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
    const productVariantCached = PRODUCT_VARIANT_CACHED[href];
    if (PRODUCT_VARIANT_CACHED[href]) {
      productId = productVariantCached.productId ?? null;
      logging.info(LOGGING_PREFIX, `[Already product variant]: ${url.pathname}`);
      continue;
    }

    logging.info(LOGGING_PREFIX, url.pathname);
    await page.goto(href);

    if (productId === null) {
      productId = generateUniqueId();
    }

    const productVariants = await crawlProductVariant(productId, page);

    // Save to JSON
    PRODUCT_VARIANT_CACHED[href] = productVariants;
    saveDataToJsonFile(PATH_VARIANT_JSON, PRODUCT_VARIANT_CACHED);

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
  product = await crawlProduct(page);
  product.variantIds = hrefList;

  // Save to JSON
  PRODUCT_CACHED[productId] = product;
  saveDataToJsonFile(PATH_PRODUCT_JSON, PRODUCT_CACHED);

  return product;
}

async function crawlProduct(page: Page): Promise<Product> {
  return page.$eval(
    PRODUCT_DETAIL_SELECTOR.ROOT,
    (root, selector) => {
      const REGEX_REMOVE_ATTRIBUTE_CLASS = /\s*class="[^"]*"/g;
      const REGEX_REMOVE_SCROLL_ELEMENT =
        /<div[^>]*data-testid="size-chart-scrollbar"[^>]*role="scrollbar"[^>]*>[\s\S]*?<\/div><\/div>/g;

      const [, , category] = root.querySelectorAll(selector.CATEGORY);

      return {
        category: category?.textContent?.trim() ?? 'Sandals',
        name: root.querySelector(selector.NAME)?.textContent?.trim() ?? '',
        shortDescription: root.querySelector(selector.SHORT_DESCRIPTION)?.textContent?.trim() ?? '',
        attrs: Array.from(root.querySelectorAll(selector.SPECIFICATION)).map((el) => ({
          key: el.querySelector(selector.SPECIFICATION_KEY)?.textContent?.trim() ?? '',
          value:
            el
              .querySelector(selector.SPECIFICATION_VALUE)
              ?.innerHTML.trim()
              .replace(REGEX_REMOVE_ATTRIBUTE_CLASS, '')
              .replace(REGEX_REMOVE_SCROLL_ELEMENT, '') ?? '',
        })),
        variantIds: [],
      };
    },
    PRODUCT_DETAIL_SELECTOR,
  );
}

async function crawlProductVariant(productId: string, page: Page): Promise<ProductVariant> {
  return page.$eval(
    PRODUCT_VARIANT_SELECTOR.ROOT,
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

      return {
        productId: id,
        color: productColorName,
        price,
        discountPrice,
        images,
        sizes: productSizes.map((size) => ({
          size,
          stock: 1,
        })),
      };
    },
    PRODUCT_VARIANT_SELECTOR,
    productId,
  );
}
