import type { InsertOneResult } from 'mongodb';
import slug from 'slug';
import { createImage } from '~/helpers/createImage';
import type { ProductReqBody, SkuModel } from '~/models/productModel';
import { cloudinaryProvider } from '~/providers/cloudinaryProvider';
import { SkuModelRepository } from '~/repositories/implements/SkuModelRepository';
import { MulterManyFile } from '~/types/requestMulter';

export class SkuService {
  private skuModel: SkuModelRepository;

  constructor() {
    this.skuModel = new SkuModelRepository();
  }

  public getBySlugify(slugify: string) {
    return this.skuModel.findOneBySlugify(slugify);
  }

  public async create(productId: string, skus: ProductReqBody['skus']) {
    const promises: Promise<InsertOneResult<SkuModel>>[] = [];

    skus.forEach(async (item) => {
      const data = {
        ...item,
        productId,
        slugify: slug(item.name),
      };

      const sku = this.skuModel.create(data);
      promises.push(sku);
    });

    return Promise.all(promises);
  }

  public async update(id: string, data: Record<string, unknown>, files: MulterManyFile | undefined) {
    if (files && Array.isArray(files)) {
      const buffers = files.map((item) => item.buffer);
      const uploadManyImageResult = await cloudinaryProvider.streamUploadArray(buffers, '/hermes-shop/products');
      const images = uploadManyImageResult.filter(Boolean).map((upload) => createImage(upload!));
      return this.skuModel.update(id, { images });
    }

    return this.skuModel.update(id, data);
  }
}
