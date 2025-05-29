export enum PRODUCT_DETAIL_SELECTOR {
  ROOT = '#pdp-container',
  NAME = 'h1',
  SHORT_DESCRIPTION = 'h1 ~ p > span',
  CATEGORY = 'div.PdpBreadcrumbs__trail a',
  IMAGE = 'div.PdpImageGallery__image img',
  PRICE = '.PdpPrice__price',
  SPECIFICATION = '.PdpAttributes:not(.mt-0) > div',
  SPECIFICATION_KEY = 'button.Dropdown__header',
  SPECIFICATION_VALUE = 'div.Dropdown__accordion > .Accordion > .hiddenChildren > div',
}
export enum COLLECTION_PRODUCT_SELECTOR {
  ITEM = '.MasterProductCard',
  ITEM_LINK = 'a',
  ITEM_BUTTON = 'button.ThumbnailButton',
}
export enum SKU_SELECTOR {
  ROOT = '#pdp-container > div > div:first-child',
  LEFT_SIDE = '& > :not(aside)',
  ASIDE = 'aside',
  PRICE = 'h1 + div > p',
  IMAGE = '.PdpCarousel .PdpCarousel__slide--image:not(.PdpCarousel__slide--last) img',
  COLOR = '.ColorSwatchButton.SwatchList__item.ColorSwatchButton--active',
  COLOR_STYLE = '.ColorSwatch',
  SIZE_LIST = '#pdp-size-selector ul.PdpSizeSelector__grid > li.PdpSizeSelector__grid-item > button',
}
export const LOGGING_PREFIX = '[Crawl]';
export const PATH_PRODUCT_JSON = './src/crawler/crawl-product.json';
export const PATH_SKU_JSON = './src/crawler/crawl-sku.json';
export const PATH_IMAGE_JSON = './src/crawler/crawl-image.json';
