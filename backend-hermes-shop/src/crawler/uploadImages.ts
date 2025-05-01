import env from '~/configs/environment';
import { createImage } from '~/helpers/createImage';
import type { Image } from '~/models/imageModel';
import { cloudinaryProvider } from '~/providers/cloudinaryProvider';
import { LOGGING_PREFIX, PATH_IMAGE_JSON } from './constants';
import { readDataFromJsonFile } from './utils';

type ImageMap = Record<string, Image>;
const IMAGE_CACHED: ImageMap = readDataFromJsonFile<ImageMap>(PATH_IMAGE_JSON) || {};

export async function uploadImages(value: string[] | Image[]): Promise<Image[]> {
  const imageLength = value.length;
  let currentProcess = 0;

  const imagePromises = value.map(async (image) => {
    if (typeof image !== 'string') return image;
    if (IMAGE_CACHED[image]) return IMAGE_CACHED[image];

    const imageUrl = 'https:' + image;
    const imageRes = await cloudinaryProvider.fileNameUpload(imageUrl, env.CLOUDINARY_FOLDER_NAME + 'products');
    const imageData = createImage(imageRes);
    IMAGE_CACHED[image] = imageData;

    currentProcess++;
    logging.info(LOGGING_PREFIX, `${currentProcess}/${imageLength}`);

    return imageData;
  });

  return Promise.all(imagePromises);
}
