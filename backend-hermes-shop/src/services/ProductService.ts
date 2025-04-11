import type { Request } from 'express';
import slug from 'slug';
import { StatusCodes } from '~/configs/statusCode';
import NextError from '~/helpers/nextError';
import type { ProductReqBody } from '~/models/productModel';
import { cloudinaryProvider } from '~/providers/cloudinaryProvider';
import { ProductModelRepository } from '~/repositories/implements/ProductModelRepository';
import { SkuModelRepository } from '~/repositories/implements/SkuModelRepository';

type CreateReqBody = Omit<Request<unknown, unknown, ProductReqBody>['body'], 'skus'>;

export class ProductService {
  private productModel: ProductModelRepository;
  private skuModel: SkuModelRepository;

  constructor() {
    this.productModel = new ProductModelRepository();
    this.skuModel = new SkuModelRepository();
  }

  public getAll() {
    return this.productModel.collectionName.find().toArray();
  }

  public async getDetail(slugify: string) {
    const product = await this.productModel.getDetailsBySlugify(slugify);
    if (!product) throw new NextError(StatusCodes.NOT_FOUND, 'Product not found!');
    return product;
  }

  public async create(data: CreateReqBody) {
    const existProduct = await this.productModel.findOneByName(data.name);
    if (existProduct) throw new NextError(StatusCodes.CONFLICT, 'Product already exists!');

    const insertedOneResult = await this.productModel.create({ ...data, slugify: slug(data.name) });
    return this.productModel.findOneById(insertedOneResult.insertedId);
  }

  public async update(id: string, data: Record<string, unknown>) {
    return this.productModel.update(id, data);
  }

  public async destroyById(id: string) {
    const deletedProduct = await this.productModel.destroyById(id);
    if (!deletedProduct) throw new NextError(StatusCodes.NOT_FOUND, 'Product not found!');

    const deletedSkuPromises = deletedProduct.skuIds.map((skuId) => this.skuModel.destroyById(skuId));
    const deleteSkus = await Promise.all(deletedSkuPromises);

    for (const sku of deleteSkus) {
      if (sku && sku?.images) {
        const publicIds = sku.images.map((item) => item.publicId);
        await cloudinaryProvider.deleteAssetArray(publicIds);
      }
    }

    return { deleteResult: 'Product and its Skus deleted successfully!' };
  }
}
