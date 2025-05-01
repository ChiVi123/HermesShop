import '~/configs/environment';
import '~/types/globals';
import '~/utils/logging';

import 'express';

import { PATH_PRODUCT_JSON } from './constants';
import { crawlCollection } from './crawl';
import type { ProductJSON } from './types';
import { readDataFromJsonFile, saveDataToJsonFile } from './utils';

// logging.info('[App] Mongodb connecting...');

// connectDB()
//   .then(() => {
//     logging.info('[App] Mongodb connected');
//   })
//   .then(async () => {
//     await startApp();

//     AsyncExitHook(() => {
//       logging.info('[App] Exit');
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
    logging.info('[App] No product collection created');
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

crawlData();
