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

    const [, rootBreadcrumb, category] = await page.$$eval(BREADCRUMB_SELECTOR, (elements) =>
      elements.map((el) => el.textContent?.trim() ?? ''),
    );
    const productNameText = await page.$eval(PRODUCT_NAME_SELECTOR, (el) => el.textContent?.trim() ?? '');
    const productShortDescriptionText = await page.$eval(
      PRODUCT_SHORT_DESCRIPTION_SELECTOR,
      (el) => el.textContent?.trim() ?? '',
    );
    const productSections = await page.$$eval('.PageSections > section[data-testid="attributes"] > div', (elements) =>
      elements.map((el) => {
        const key = el.querySelector('button.Dropdown__header')?.textContent?.trim() ?? '';
        const value =
          el.querySelector('div.Dropdown__accordion > .Accordion > .hiddenChildren > div')?.innerHTML?.trim() ?? '';
        return { key, value };
      }),
    );

    const data = {
      name: productNameText,
      shortDescription: productShortDescriptionText,
      gender: rootBreadcrumb.includes('Men') ? 'Men' : 'Women',
      category,
      attrs: productSections.map((item) => ({
        ...item,
        value: item.value.replace(PRODUCT_SECTION_CONTENT_CLASS_REGEX, ''),
      })),
    };

    logging.info('data', data);

    await page.close();
    await browser.close();
    logging.info('Page closed and browser closed');
  } catch (error) {
    logging.danger('Error crawling website:', error);
  }
}
