import type { Request, Response } from 'express';
import { StatusCodes } from '~/configs/statusCode';
import Controller from '~/controllers/Controller';
import controllerDecorator from '~/decorators/controllerDecorator';
import routeDecorator from '~/decorators/routeDecorator';
import validateDecorator from '~/decorators/validateDecorator';
import type { ProductReqBody } from '~/models/productModel';
import { ProductService } from '~/services/ProductService';
import { SkuService } from '~/services/SkuService';
import { productSchema } from '~/validates/productValidate';

@controllerDecorator('/v1/products')
class ProductController extends Controller {
  private productService: ProductService;
  private skuService: SkuService;

  constructor() {
    super();
    this.productService = new ProductService();
    this.skuService = new SkuService();
  }

  @routeDecorator('get', '/all')
  async getAll(_req: Request, res: Response) {
    const result = await this.productService.getAll();
    console.log('product controller', result);

    res.status(StatusCodes.OK).json(result);
  }

  @routeDecorator('get', '/:slugify')
  async getDetail(req: Request, res: Response) {
    const result = await this.productService.getDetail(req.params.slugify);
    console.log('🚀 ~ ProductController ~ getDetail ~ result:', result);

    res.status(StatusCodes.OK).json(result);
  }

  @routeDecorator('post', '/new')
  @validateDecorator(productSchema)
  async create(req: Request<unknown, unknown, ProductReqBody>, res: Response) {
    const { skus, ...data } = req.body;
    const productCreated = (await this.productService.create(data))!;
    const insertedOneResults = await this.skuService.create(productCreated._id.toString(), skus);
    const productUpdated = await this.productService.pushSkuIds(productCreated._id, insertedOneResults);

    res.status(StatusCodes.CREATED).json(productUpdated);
  }

  @routeDecorator('delete', '/destroy-all')
  async destroyAll(_req: Request, res: Response) {
    const productDestroyResult = await this.productService.destroyAll();
    const skuDestroyResult = await this.skuService.destroyAll();
    res.status(StatusCodes.CREATED).json({ productDestroyResult, skuDestroyResult });
  }
}

export default ProductController;
