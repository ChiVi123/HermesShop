import type { Request } from 'express';
import type { InsertOneResult, ObjectId } from 'mongodb';
import slug from 'slug';
import { StatusCodes } from '~/configs/statusCode';
import NextError from '~/helpers/nextError';
import type { ProductReqBody, SkuModel } from '~/models/productModel';
import { ProductModelRepository } from '~/repositories/implements/ProductModelRepository';

type CreateReqBody = Omit<Request<unknown, unknown, ProductReqBody>['body'], 'skus'>;

export class ProductService {
  private productModel: ProductModelRepository;

  constructor() {
    this.productModel = new ProductModelRepository();
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

  public async pushSkuIds(productId: string | ObjectId, insertedOneResults: InsertOneResult<SkuModel>[]) {
    return this.productModel.pushSkuIds(
      productId,
      insertedOneResults.map((item) => item.insertedId),
    );
  }

  public destroyAll() {
    return this.productModel.destroyAll();
  }
}
