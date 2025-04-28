import type { Page } from 'puppeteer';
import puppeteer from 'puppeteer';
import env from '~/configs/environment';
import { createImage } from '~/helpers/createImage';
import type { Image } from '~/models/imageModel';
import { cloudinaryProvider } from '~/providers/cloudinaryProvider';
import { COLLECTION_PRODUCT_SELECTOR, LOGGING_PREFIX, PRODUCT_DETAIL_SELECTOR, SKU_SELECTOR } from './constants';
import type { Product, Sku } from './types';
import { randomInt, urlValidation } from './utils';

const MIN_STOCK = 10;
const MAX_STOCK = 20;

const imageCached: Map<string, Image> = new Map();

export async function crawlCollection(url: string): Promise<Product[] | undefined> {
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

    const products = [];
    const maxProductLength = productLinkList.length;
    let currentProcess = 0;

    for (const productVariantLinks of productLinkList) {
      const product = await crawlWebsiteProduct(productVariantLinks, page);
      if (product) {
        products.push(product);
        currentProcess++;
        logging.info(LOGGING_PREFIX, `${currentProcess}/${maxProductLength}`);
      }
    }

    return products;
  } catch (error) {
    logging.danger(LOGGING_PREFIX, 'Error crawling website:', error);
  } finally {
    // Close the page and browser
    logging.info(LOGGING_PREFIX, 'Closing page and browser ...');
    await page.close();
    await browser.close();
    logging.info(LOGGING_PREFIX, 'Page closed and browser closed');
    logging.info(LOGGING_PREFIX, 'collection finished');
  }
}
async function crawlWebsiteProduct(hrefList: string[], page: Page): Promise<Product | undefined> {
  if (hrefList.length === 0) {
    logging.info(LOGGING_PREFIX, 'No product found');
    return;
  }

  let product = null;

  for (const href of hrefList) {
    if (!urlValidation(href)) {
      logging.info(LOGGING_PREFIX, 'Invalid URL:', href);
      continue;
    }
    await page.goto(href);

    logging.info(LOGGING_PREFIX, 'Href:', page.url());

    if (product === null) {
      product = await crawlProductRaw(page);
    } else {
      const skus = await crawlProductSkuRaw(page);
      product.skus.push(...skus);
    }
  }

  if (product === null) {
    logging.info(LOGGING_PREFIX, 'No product found');
    return;
  }

  // logging.info(LOGGING_PREFIX, 'Upload images...');

  for (const sku of product.skus) {
    // sku.images = await uploadSkuImages(sku.images);
    sku.stock = randomInt(MIN_STOCK, MAX_STOCK + 1);
  }

  // logging.info(LOGGING_PREFIX, 'Upload images done!');

  return product;
}
async function crawlProductRaw(page: Page): Promise<Product> {
  const product = await page.$eval(
    PRODUCT_DETAIL_SELECTOR.ROOT,
    (root, selector) => {
      const [, , category] = root.querySelectorAll(selector.CATEGORY);

      return {
        category: category.textContent?.trim() ?? '',
        name: root.querySelector(selector.NAME)?.textContent?.trim() ?? '',
        shortDescription: root.querySelector(selector.SHORT_DESCRIPTION)?.textContent?.trim() ?? '',
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
        specs: Array.from(root.querySelectorAll(selector.SPECIFICATION)).map((el) => ({
          key: el.querySelector(selector.SPECIFICATION_KEY)?.textContent?.trim() ?? '',
          value:
            el
              .querySelector(selector.SPECIFICATION_VALUE)
              ?.innerHTML.trim()
              .replace(/ (class|id|role|data-testid|aria-labelledby|tabindex)="[^"]*"/g, '') ?? '',
        })),
      };
    },
    PRODUCT_DETAIL_SELECTOR,
  );
  const skus = await crawlProductSkuRaw(page);

  return { ...product, skus };
}

async function crawlProductSkuRaw(page: Page): Promise<Sku[]> {
  return page.$eval(
    SKU_SELECTOR.ROOT,
    (root, selector) => {
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
  );
}
function uploadSkuImages(images: string[] | Image[]) {
  const imagePromises = images.map(async (image) => {
    if (typeof image !== 'string') return image;
    if (imageCached.has(image)) return imageCached.get(image)!;

    const imageUrl = 'https:' + image;
    const imageRes = await cloudinaryProvider.fileNameUpload(imageUrl, env.CLOUDINARY_FOLDER_NAME + 'products');
    const imageData = createImage(imageRes);
    imageCached.set(image, imageData);
    return imageData;
  });

  return Promise.all(imagePromises);
}
