import type { UploadApiResponse } from 'cloudinary';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import env from '~/configs/environment';

const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

function streamUploadSingle(fileBuffer: Buffer, folderName: string) {
  return new Promise<UploadApiResponse | undefined>((resolve, reject) => {
    const stream = cloudinaryV2.uploader.upload_stream({ folder: folderName }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
}
function streamUploadArray(fileBuffers: Buffer[], folderName: string) {
  const promises = fileBuffers.map((buffer) => streamUploadSingle(buffer, folderName));
  return Promise.all(promises);
}
function deleteSingleAsset(publicId: string) {
  return cloudinaryV2.uploader.destroy(publicId, { resource_type: 'image' });
}
function deleteAssetArray(publicIds: string[]) {
  const promises = publicIds.map(deleteSingleAsset);
  return Promise.all(promises);
}

export const cloudinaryProvider = { streamUploadSingle, streamUploadArray, deleteSingleAsset, deleteAssetArray };
