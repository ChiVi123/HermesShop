import '~/configs/environment';
import '~/types/globals';
import '~/utils/logging';

import 'express';

import { PATH_FILE_JSON } from './constants';
import { crawlCollection } from './crawl';
import type { DataJSON } from './types';
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

const startApp = async () => {
  const data = await crawlCollection(process.env.CRAWL_URL ?? '');
  if (!data) {
    logging.info('[App] No product collection created');
    return;
  }
  const dataJSON = readDataFromJsonFile<DataJSON>(PATH_FILE_JSON);

  dataJSON.products.push(...data.products);
  Object.assign(dataJSON.imageCached, data.imageCached);
  dataJSON.urlCached.push(...data.urlCached);

  saveDataToJsonFile(PATH_FILE_JSON, dataJSON);
};

startApp();
