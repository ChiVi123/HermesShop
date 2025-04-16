import type { Request, Response } from 'express';
import { StatusCodes } from '~/configs/statusCodes';
import Controller from '~/controllers/Controller';
import controllerDecorator from '~/decorators/controllerDecorator';
import routeDecorator from '~/decorators/routeDecorator';
import validateDecorator from '~/decorators/validateDecorator';
import { multerMiddleware } from '~/middlewares/multerMiddleware';
import type { ProductReqBody } from '~/models/productModel';
import { ProductService } from '~/services/ProductService';
import { SkuService } from '~/services/SkuService';
import { createProductValidate } from '~/validates/productValidate';
import { skuValidate } from '~/validates/skuValidate';

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
  public async getAll(_req: Request, res: Response) {
    const result = await this.productService.getAll();
    res.status(StatusCodes.OK).json(result);
  }

  @routeDecorator('get', '/:slugify')
  public async getDetail(req: Request, res: Response) {
    const result = await this.productService.getDetail(req.params.slugify);
    res.status(StatusCodes.OK).json(result);
  }

  @routeDecorator('post', '/new')
  @validateDecorator(createProductValidate)
  public async create(req: Request<unknown, unknown, ProductReqBody>, res: Response) {
    const { skus, ...data } = req.body;
    const createdProduct = (await this.productService.create(data))!;
    const result = await this.skuService.createMany(createdProduct._id.toString(), skus);

    res.status(StatusCodes.CREATED).json(result);
  }

  @routeDecorator('patch', '/:id')
  @validateDecorator(createProductValidate)
  public async updateProduct(req: Request, res: Response) {
    const productId = req.params.id;
    const updatedProduct = await this.productService.update(productId, req.body);
    res.status(StatusCodes.OK).json(updatedProduct);
  }

  @routeDecorator('patch', '/sku/:id', multerMiddleware.array('images'))
  @validateDecorator(skuValidate)
  public async updateSku(req: Request, res: Response) {
    const skuId = req.params.id;
    const updatedSku = await this.skuService.update(skuId, req.body, req.files);
    res.status(StatusCodes.OK).json(updatedSku);
  }

  @routeDecorator('delete', '/:id')
  public async destroyProduct(req: Request, res: Response) {
    const productId = req.params.id;
    const result = await this.productService.destroyById(productId);
    res.status(StatusCodes.OK).json(result);
  }
}

export default ProductController;
