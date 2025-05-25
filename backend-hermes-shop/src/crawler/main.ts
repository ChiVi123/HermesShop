import '~/configs/environment';
import '~/types/globals';
import '~/utils/logging';

import 'express';

import AsyncExitHook from 'async-exit-hook';
import readline from 'readline';
import slug from 'slug';
import { closeDB, connectDB } from '~/core/mongodb';
import { PATH_PRODUCT_JSON } from './constants';
import { crawlCollection } from './crawl';
import { uploadDataCrawled } from './mongodb';
import { type ProductJSON } from './types';
import { uploadImages } from './uploadImages';
import { readDataFromJsonFile, saveDataToJsonFile } from './utils';

const LOGGING_APP_PREFIX = '[App]';
const LOGGING_APP_ERROR_PREFIX = '[App Error]';

// config slug charmap
slug.charmap['/'] = '-';

logging.info(LOGGING_APP_PREFIX, 'Mongodb connecting...');

connectDB()
  .then(() => {
    logging.info(LOGGING_APP_PREFIX, 'Mongodb connected');
  })
  .then(() => {
    const readline = startReadline();

    AsyncExitHook(() => {
      logging.info(LOGGING_APP_PREFIX, 'Exit');
      readline.close();
      closeDB();
    });
  })
  .catch((error) => {
    logging.danger(LOGGING_APP_ERROR_PREFIX, error);
    process.exit(0);
  });

function startReadline(): readline.Interface {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  logging.info(LOGGING_APP_PREFIX, 'Listening input...');
  rl.on('line', async (input) => {
    const dataJSON = readDataFromJsonFile<ProductJSON>(PATH_PRODUCT_JSON);
    const jsonProducts = dataJSON.products || [];

    switch (input.trim()) {
      case 'crawl':
        logging.info(LOGGING_APP_PREFIX, 'Starting crawl...');
        crawlData().catch((error) => logging.danger(LOGGING_APP_ERROR_PREFIX, error));

        break;
      case 'image':
        logging.info(LOGGING_APP_PREFIX, 'Starting upload image...');

        for (const product of jsonProducts) {
          logging.info(LOGGING_APP_PREFIX, `[${product.name}]`);

          for (const sku of product.skus) {
            if (sku.images) {
              sku.images = await uploadImages(sku.images);
            }
          }
          logging.info(LOGGING_APP_PREFIX, `[${product.name}] Uploaded images`);
        }

        saveDataToJsonFile(PATH_PRODUCT_JSON, dataJSON);

        break;
      case 'mongo':
        await uploadDataCrawled();

        break;
      case 'help':
        console.log('\nUsage: ');
        console.log('crawl  - Start crawling data');
        console.log('image  - Start uploading images');
        console.log('mongo   - Start upload data to mongodb');
        console.log('help   - Show help');
        console.log('exit or other - Exit the application\n');
        break;
      case 'exit':
      default:
        process.exit(0);
    }

    logging.info(LOGGING_APP_PREFIX, 'Listening input...');
  });

  return rl;
}

const crawlData = async () => {
  const data = await crawlCollection(process.env.CRAWL_URL ?? '');
  if (!data) {
    logging.info(LOGGING_APP_PREFIX, 'No product collection created');
    return;
  }
  const dataJSON = readDataFromJsonFile<ProductJSON>(PATH_PRODUCT_JSON);

  data.products.forEach((product) => {
    const existingProductIndex = dataJSON.products.findIndex((p) => p.name === product.name);
    if (existingProductIndex !== -1) {
      dataJSON.products[existingProductIndex] = product; // Update existing product
    } else {
      dataJSON.products.push(product); // Add new product
    }
  });
  Object.assign(dataJSON.urlCached, data.urlCached);

  saveDataToJsonFile(PATH_PRODUCT_JSON, dataJSON);
};
