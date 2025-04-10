import type { InsertOneResult } from 'mongodb';
import slug from 'slug';
import type { ProductReqBody, SkuModel } from '~/models/productModel';
import { SkuModelRepository } from '~/repositories/implements/SkuModelRepository';

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

  public destroyAll() {
    return this.skuModel.destroyAll();
  }
}
