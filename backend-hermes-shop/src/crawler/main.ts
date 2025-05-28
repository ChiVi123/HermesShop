import '~/configs/environment';
import '~/types/globals';
import '~/utils/logging';

import 'express';

import AsyncExitHook from 'async-exit-hook';
import readline from 'readline';
import slug from 'slug';
import { closeDB, connectDB } from '~/core/mongodb';
import { crawlCollection } from './crawl';

const LOGGING_APP_PREFIX = '[App]';
const LOGGING_APP_ERROR_PREFIX = '[App Error]';

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
    // const dataJSON = readDataFromJsonFile<ProductJSON>(PATH_PRODUCT_JSON);

    switch (input.trim()) {
      case 'crawl':
        logging.info(LOGGING_APP_PREFIX, 'Starting crawl...');
        await crawlCollection(process.env.CRAWL_URL ?? '').catch((error) =>
          logging.danger(LOGGING_APP_ERROR_PREFIX, error),
        );

        break;
      case 'image':
        logging.info(LOGGING_APP_PREFIX, 'Starting upload image...');

        // TODO: create function upload property images

        // for (const product of jsonProducts) {
        //   logging.info(LOGGING_APP_PREFIX, `[${product.name}]`);

        //   for (const sku of product.skus) {
        //     if (sku.images) {
        //       sku.images = await uploadImages(sku.images);
        //     }
        //   }
        //   logging.info(LOGGING_APP_PREFIX, `[${product.name}] Uploaded images`);
        // }

        // saveDataToJsonFile(PATH_PRODUCT_JSON, dataJSON);

        break;
      case 'mongo':
        logging.info(LOGGING_APP_PREFIX, 'Mongodb connecting...');

        connectDB()
          .then(() => {
            logging.info(LOGGING_APP_PREFIX, 'Mongodb connected');
          })
          .then(async () => {
            // TODO: refactor uploadDataCrawled
            // await uploadDataCrawled();

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
        console.log('crawl  - Start crawling data');
        console.log('image  - Start uploading images');
        console.log('mongo   - Start upload data to mongodb');
        console.log('help   - Show help');
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
