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

    const hrefs = await page.$eval('.MasterProductCard', (element) => {
      const buttons = element.querySelectorAll<HTMLButtonElement>('button.ThumbnailButton');
      return Array.from(buttons).map((button) => {
        button.click();
        return element.querySelector<HTMLAnchorElement>('a')?.href;
      });
    });

    logging.info('[crawl] Colorway links:', hrefs);

    logging.info('[crawl] Closing page and browser', '...');
    await page.close();
    await browser.close();
    logging.info('[crawl] Page closed and browser closed');
  } catch (error) {
    logging.danger('[crawl] Error crawling website:', error);
  }
}
