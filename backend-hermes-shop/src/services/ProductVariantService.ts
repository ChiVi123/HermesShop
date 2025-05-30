import slug from 'slug';
import { createImage } from '~/helpers/createImage';
import type { ProductReqBody } from '~/models/productModel';
import { cloudinaryProvider } from '~/providers/cloudinaryProvider';
import { ProductVariantModelRepository } from '~/repositories/implements/ProductVariantModelRepository';
import type { MulterManyFile } from '~/types/requestMulter';

export class ProductVariantService {
  private productVariantRepository: ProductVariantModelRepository;

  constructor() {
    this.productVariantRepository = new ProductVariantModelRepository();
  }

  public getBySlugify(slugify: string) {
    return this.productVariantRepository.findOneBySlugify(slugify);
  }

  public async createMany(productId: string, variants: ProductReqBody['variants']) {
    return this.productVariantRepository.createMany(
      variants.map((item) => ({
        ...item,
        productId,
        slugify: slug(item.name),
      })),
    );
  }

  public async update(id: string, data: Record<string, unknown>, files: MulterManyFile | undefined) {
    if (files && Array.isArray(files)) {
      const buffers = files.map((item) => item.buffer);
      const uploadManyImageResult = await cloudinaryProvider.streamUploadArray(buffers, '/hermes-shop/products');
      const images = uploadManyImageResult.filter(Boolean).map((upload) => createImage(upload!));
      return this.productVariantRepository.findOneAndUpdateById(id, { images });
    }

    return this.productVariantRepository.findOneAndUpdateById(id, data);
  }
}
