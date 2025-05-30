import type { Request } from 'express';
import slug from 'slug';
import { StatusCodes } from '~/configs/statusCodes';
import NextError from '~/helpers/nextError';
import type { ProductReqBody } from '~/models/productModel';
import { CategoryModelRepository } from '~/repositories/implements/CategoryModelRepository';
import { ProductModelRepository } from '~/repositories/implements/ProductModelRepository';

type CreateReqBody = Omit<Request<unknown, unknown, ProductReqBody>['body'], 'variants'>;

export class ProductService {
  private productRepository: ProductModelRepository;
  private categoryRepository: CategoryModelRepository;

  constructor() {
    this.productRepository = new ProductModelRepository();
    this.categoryRepository = new CategoryModelRepository();
  }

  public getAll() {
    return this.productRepository.findAll();
  }

  public async getDetail(slugify: string) {
    const product = await this.productRepository.getDetailsBySlugify(slugify);
    if (!product) throw new NextError(StatusCodes.NOT_FOUND, 'Product not found!');
    return product;
  }

  public async create(data: CreateReqBody) {
    const existProduct = await this.productRepository.findOneByName(data.name);
    if (existProduct) throw new NextError(StatusCodes.CONFLICT, 'Product already exists!');

    const existCategory = await this.categoryRepository.findOneById(data.categoryId);
    if (!existCategory) throw new NextError(StatusCodes.NOT_FOUND, 'Category not found!');

    const insertedOneResult = await this.productRepository.insertOne({ ...data, slugify: slug(data.name) });
    return this.productRepository.findOneById(insertedOneResult.insertedId);
  }

  public async update(id: string, data: Record<string, unknown>) {
    return this.productRepository.findOneAndUpdateById(id, data);
  }

  public async destroyById(id: string) {
    const deletedProduct = await this.productRepository.destroyById(id);
    if (!deletedProduct) throw new NextError(StatusCodes.NOT_FOUND, 'Product not found!');

    // TODO: delete all productVariants relate and all images, image save in mongo -> destroy both mongodb and cloudinary
    // for (const productVariant of deleteProductVariants) {
    //   if (productVariant && productVariant?.images) {
    //     const publicIds = productVariant.images.map((item) => item.publicId);
    //     await cloudinaryProvider.deleteAssetArray(publicIds);
    //   }
    // }

    return { deleteResult: 'Product and its variants deleted successfully!' };
  }
}
