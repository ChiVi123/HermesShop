import '~/configs/environment';
import '~/types/globals';
import '~/utils/logging';

import 'express';

import { crawlCollection } from './crawl';
import { saveDataToJsonFile } from './utils';

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

const startApp = async () => {
  const productCollection = await crawlCollection(process.env.CRAWL_URL ?? '');
  if (!productCollection) {
    logging.info('[App] No product collection created');
    return;
  }

  saveDataToJsonFile('./src/crawler/crawl-data.json', productCollection);
};

startApp();
