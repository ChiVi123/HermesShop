import '~/configs/environment';
import '~/types/globals';
import '~/utils/logging';

import 'express';

import AsyncExitHook from 'async-exit-hook';
import readline from 'readline';
import slug from 'slug';
import { closeDB, connectDB } from '~/core/mongodb';
import { PATH_SKU_JSON } from './constants';
import { crawlCollection } from './crawl';
import { uploadDataCrawled } from './mongodb';
import type { SkuJSON } from './types';
import { uploadImages } from './uploadImages';
import { randomInt, readDataFromJsonFile, saveDataToJsonFile } from './utils';

const LOGGING_APP_PREFIX = '[App]';
const LOGGING_APP_ERROR_PREFIX = '[App Error]';

const MIN_STOCK = 10;
const MAX_STOCK = 20;

// config slug charmap
slug.charmap['/'] = '-';

startReadline();

function startReadline(): void {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  logging.info(LOGGING_APP_PREFIX, 'Listening input...');
  rl.on('line', async (input) => {
    switch (input.trim()) {
      case 'crawl':
        logging.info(LOGGING_APP_PREFIX, 'Starting crawl...');
        await crawlCollection(process.env.CRAWL_URL ?? '').catch((error) =>
          logging.danger(LOGGING_APP_ERROR_PREFIX, error),
        );

        break;
      case 'image':
        logging.info(LOGGING_APP_PREFIX, 'Starting upload image...');

        await uploadSkuImages();

        break;
      case 'mongo':
        logging.info(LOGGING_APP_PREFIX, 'Mongodb connecting...');

        connectDB()
          .then(() => {
            logging.info(LOGGING_APP_PREFIX, 'Mongodb connected');
          })
          .then(async () => {
            await uploadDataCrawled();

            AsyncExitHook(() => {
              logging.info(LOGGING_APP_PREFIX, 'Exit');
              rl.close();
              closeDB();
            });
          })
          .catch((error) => {
            logging.danger(LOGGING_APP_ERROR_PREFIX, error);
          })
          .finally(() => {
            process.exit(0);
          });

        break;
      case 'help':
        console.log('\nUsage: ');
        console.log('crawl         - Start crawling data');
        console.log('image         - Start uploading images');
        console.log('mongo         - Start upload data to mongodb');
        console.log('help          - Show help');
        console.log('exit or other - Exit the application\n');
        break;
      case 'exit':
      default:
        logging.info(LOGGING_APP_PREFIX, 'Exit');
        rl.close();
        process.exit(0);
    }

    logging.info(LOGGING_APP_PREFIX, 'Listening input...');
  });
}

async function uploadSkuImages() {
  const skuJSON = readDataFromJsonFile<SkuJSON>(PATH_SKU_JSON) || {};

  for (const skus of Object.values(skuJSON)) {
    for (const sku of skus) {
      sku.images = await uploadImages(sku.images);
      sku.stock = randomInt(MIN_STOCK, MAX_STOCK + 1);
    }
  }

  saveDataToJsonFile(PATH_SKU_JSON, skuJSON);

  logging.info(LOGGING_APP_PREFIX, 'Update sku data successfully');
}
