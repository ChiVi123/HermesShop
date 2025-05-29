import env from '~/configs/environment';
import { createImage } from '~/helpers/createImage';
import type { Image } from '~/models/imageModel';
import { cloudinaryProvider } from '~/providers/cloudinaryProvider';
import { LOGGING_PREFIX, PATH_IMAGE_JSON } from './constants';
import type { ImageJSON } from './types';
import { readDataFromJsonFile, saveDataToJsonFile } from './utils';

const IMAGE_CACHED: ImageJSON = readDataFromJsonFile<ImageJSON>(PATH_IMAGE_JSON) || {};

export async function uploadImages(value: string[] | Image[]): Promise<Image[]> {
  const imagePromises = value.map(async (image) => {
    if (typeof image !== 'string') {
      logging.info(LOGGING_PREFIX, 'Image already exist', image.publicId);
      return image;
    }
    const imageCached = IMAGE_CACHED[image];
    if (imageCached) {
      logging.info(LOGGING_PREFIX, 'Image hit', imageCached.publicId);
      return imageCached;
    }

    const imageUrl = 'https:' + image;
    const imageRes = await cloudinaryProvider.fileNameUpload(imageUrl, env.CLOUDINARY_FOLDER_NAME + 'products');
    const imageData = createImage(imageRes);
    IMAGE_CACHED[image] = imageData;

    logging.info(LOGGING_PREFIX, 'Image upload to cloud', imageData.publicId);

    return imageData;
  });

  saveDataToJsonFile(PATH_IMAGE_JSON, IMAGE_CACHED);

  return Promise.all(imagePromises);
}
