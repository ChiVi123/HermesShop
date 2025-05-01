import '~/configs/environment';
import '~/types/globals';
import '~/utils/logging';

import 'express';

import readline from 'readline';
import { PATH_PRODUCT_JSON } from './constants';
import { crawlCollection } from './crawl';
import { type ProductJSON } from './types';
import { uploadImages } from './uploadImages';
import { readDataFromJsonFile, saveDataToJsonFile } from './utils';

const LOGGING_APP_PREFIX = '[App]';
const LOGGING_APP_ERROR_PREFIX = '[App Error]';

// logging.info(LOGGING_APP_PREFIX, 'Mongodb connecting...');

// connectDB()
//   .then(() => {
//     logging.info(LOGGING_APP_PREFIX, 'Mongodb connected');
//   })
//   .then(async () => {
//     await startApp();

//     AsyncExitHook(() => {
//       logging.info(LOGGING_APP_PREFIX, 'Exit');
//       closeDB();
//     });
//   })
//   .catch((error) => {
//     logging.danger('[App Error]', error);
//     process.exit(0);
//   })
//   .finally(() => {
//     process.exit(0);
//   });

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
    case 'img':
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
    case 'help':
      console.log('\nUsage: ');
      console.log('crawl - Start crawling data');
      console.log('img (image) - Start uploading images');
      console.log('help - Show help');
      console.log('exit or other - Exit the application\n');
      break;
    case 'exit':
    default:
      logging.info(LOGGING_APP_PREFIX, 'Exiting...');
      rl.close();
      process.exit(0);
  }

  logging.info(LOGGING_APP_PREFIX, 'Listening input...');
});
