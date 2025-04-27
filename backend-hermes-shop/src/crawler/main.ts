import '~/configs/environment';
import '~/types/globals';
import '~/utils/logging';

import 'express';

import { crawlCollection } from './crawl';

crawlCollection(process.env.CRAWL_URL ?? '');
