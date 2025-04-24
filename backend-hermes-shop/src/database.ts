import puppeteer from 'puppeteer';

const BREADCRUMB_SELECTOR = 'div.PdpBreadcrumbs__trail a';
const PRODUCT_NAME_SELECTOR = 'h1';
const PRODUCT_SHORT_DESCRIPTION_SELECTOR = 'h1 ~ p > span';
const PRODUCT_SECTION_CONTENT_CLASS_REGEX = / class="[^"]*"/g; // Regex to match class attributes in HTML

export async function crawlWebsite(url: string): Promise<void> {
  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) return;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // const [, , category] = await page.$$eval(BREADCRUMB_SELECTOR, (elements) =>
    //   elements.map((el) => el.textContent?.trim() ?? ''),
    // );
    // const productNameText = await page.$eval(PRODUCT_NAME_SELECTOR, (el) => el.textContent?.trim() ?? '');
    // const productShortDescriptionText = await page.$eval(
    //   PRODUCT_SHORT_DESCRIPTION_SELECTOR,
    //   (el) => el.textContent?.trim() ?? '',
    // );
    // const productSections = await page.$$eval('.PageSections > section[data-testid="attributes"] > div', (elements) =>
    //   elements.map((el) => {
    //     const key = el.querySelector('button.Dropdown__header')?.textContent?.trim() ?? '';
    //     const value =
    //       el
    //         .querySelector('div.Dropdown__accordion > .Accordion > .hiddenChildren > div')
    //         ?.innerHTML?.trim()
    //         .replace(/ class="[^"]*"/g, '') ?? '';
    //     return { key, value };
    //   }),
    // );

    const productSelectors = await page.$$eval('.PdpProductSelectorSection', (elements) =>
      elements.map((el) => {
        const key = el.querySelector('.Overview > .Overview__label')?.textContent?.trim().replace(':', '') ?? '';
        const colors = Array.from(el.querySelectorAll('.SwatchList > button')).map(
          (button) => button.ariaLabel?.trim().replace(/\s\(.*\)/, '') ?? '',
        );
        return { key, colors };
      }),
    );
    const productSizes = await page.$eval('#pdp-size-selector', (element) => {
      const key = element.querySelector('.Overview > .Overview__title')?.textContent?.trim().replace(':', '') ?? '';
      const sizes = Array.from(
        element.querySelectorAll('ul.PdpSizeSelector__grid > li.PdpSizeSelector__grid-item > button'),
      ).map((button) => button.textContent?.trim() ?? '');
      return { key, sizes };
    });

    const skus = productSelectors.flatMap((selector) =>
      selector.colors.flatMap((color) =>
        productSizes.sizes.flatMap((size) => {
          const colorName = color.replace('Select color ', '');
          return {
            name: colorName,
            specs: [
              { key: selector.key, value: colorName },
              { key: productSizes.key, value: size },
            ],
          };
        }),
      ),
    );

    logging.info('[crawl] SKUs', skus[0].specs, skus.length);

    // const data = {
    //   name: productNameText,
    //   shortDescription: productShortDescriptionText,
    //   gender: productNameText.includes('Men') ? 'Men' : 'Women',
    //   category,
    //   attrs: productSections,
    //   options: productSelectors
    //     .map((selector) => {
    //       const { key } = selector;
    //       return {
    //         key,
    //         type: 'select_with_image',
    //       };
    //     })
    //     .concat({ key: productSizes.key, type: 'select' }),
    //   variants: productSizes,
    // };

    // logging.info('[crawl] data', data);

    logging.info('[crawl] Closing page and browser', '...');
    await page.close();
    await browser.close();
    logging.info('[crawl] Page closed and browser closed');
  } catch (error) {
    logging.danger('[crawl] Error crawling website:', error);
  }
}
