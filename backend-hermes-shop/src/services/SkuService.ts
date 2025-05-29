import slug from 'slug';
import { createImage } from '~/helpers/createImage';
import type { ProductReqBody } from '~/models/productModel';
import { cloudinaryProvider } from '~/providers/cloudinaryProvider';
import { ProductModelRepository } from '~/repositories/implements/ProductModelRepository';
import { SkuModelRepository } from '~/repositories/implements/SkuModelRepository';
import type { MulterManyFile } from '~/types/requestMulter';

export class SkuService {
  private productRepository: ProductModelRepository;
  private skuRepository: SkuModelRepository;

  constructor() {
    this.productRepository = new ProductModelRepository();
    this.skuRepository = new SkuModelRepository();
  }

  public getBySlugify(slugify: string) {
    return this.skuRepository.findOneBySlugify(slugify);
  }

  public async createMany(productId: string, skus: ProductReqBody['skus']) {
    return this.skuRepository.createMany(
      skus.map((sku) => ({
        ...sku,
        productId,
        slugify: slug(sku.name),
      })),
    );
  }

  public async update(id: string, data: Record<string, unknown>, files: MulterManyFile | undefined) {
    if (files && Array.isArray(files)) {
      const buffers = files.map((item) => item.buffer);
      const uploadManyImageResult = await cloudinaryProvider.streamUploadArray(buffers, '/hermes-shop/products');
      const images = uploadManyImageResult.filter(Boolean).map((upload) => createImage(upload!));
      return this.skuRepository.findOneAndUpdateById(id, { images });
    }

    return this.skuRepository.findOneAndUpdateById(id, data);
  }
}
