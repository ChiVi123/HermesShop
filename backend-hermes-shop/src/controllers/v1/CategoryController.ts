import type { Request, Response } from 'express';
import { StatusCodes } from '~/configs/statusCode';
import Controller from '~/controllers/Controller';
import controllerDecorator from '~/decorators/controllerDecorator';
import routeDecorator from '~/decorators/routeDecorator';
import validateDecorator from '~/decorators/validateDecorator';
import type { CategoryReqBody } from '~/models/categoryModel';
import { CategoryService } from '~/services/CategoryService';
import { createAndUpdateCategoryValidate } from '~/validates/categoryValidate';

@controllerDecorator('/v1/categories')
class CategoryController extends Controller {
  private categoryService: CategoryService;

  constructor() {
    super();
    this.categoryService = new CategoryService();
  }

  @routeDecorator('get', '/:slugify')
  public async getDetail(req: Request, res: Response) {
    const result = await this.categoryService.getBySlugify(req.params.slugify);
    res.status(StatusCodes.OK).json(result);
  }

  @routeDecorator('post', '/new')
  @validateDecorator(createAndUpdateCategoryValidate)
  public async create(req: Request<unknown, unknown, CategoryReqBody>, res: Response) {
    const result = await this.categoryService.create(req.body);
    res.status(StatusCodes.CREATED).json(result);
  }

  @routeDecorator('patch', '/:id')
  @validateDecorator(createAndUpdateCategoryValidate)
  public async updateProduct(req: Request, res: Response) {
    const categoryId = req.params.id;
    const updatedCategory = await this.categoryService.update(categoryId, req.body);
    res.status(StatusCodes.OK).json(updatedCategory);
  }
}

export default CategoryController;
