import type { UploadApiResponse } from 'cloudinary';
import type { Image } from '~/models/imageModel';

export function createImage(upload: UploadApiResponse, thumbnail?: boolean): Image {
  const date = new Date(upload.created_at);
  return {
    publicId: upload.public_id,
    url: upload.secure_url,
    width: upload.width,
    height: upload.height,
    bytes: upload.bytes,
    createdAt: date.valueOf(),
    ...(thumbnail ? { thumbnail } : {}),
  };
}
