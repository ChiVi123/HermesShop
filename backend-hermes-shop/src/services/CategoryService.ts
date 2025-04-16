import slug from 'slug';
import { StatusCodes } from '~/configs/statusCodes';
import NextError from '~/helpers/nextError';
import type { CategoryReqBody } from '~/models/categoryModel';
import { CategoryModelRepository } from '~/repositories/implements/CategoryModelRepository';

export class CategoryService {
  private categoryRepository: CategoryModelRepository;

  constructor() {
    this.categoryRepository = new CategoryModelRepository();
  }

  public getBySlugify(slugify: string) {
    return this.categoryRepository.findOneBySlugify(slugify);
  }

  public async create(data: CategoryReqBody) {
    const existCategory = await this.categoryRepository.findOneByName(data.name);
    if (existCategory) throw new NextError(StatusCodes.CONFLICT, 'Category already exists!');

    const insertedOneResult = await this.categoryRepository.insertOne({ ...data, slugify: slug(data.name) });
    return this.categoryRepository.findOneById(insertedOneResult.insertedId);
  }

  public async update(id: string, data: { name: string } & Record<string, unknown>) {
    const updatedCategory = await this.categoryRepository.findOneAndUpdateById(id, {
      ...data,
      slugify: slug(data.name),
      updatedAt: Date.now(),
    });
    if (!updatedCategory) throw new NextError(StatusCodes.NOT_FOUND, 'Category not found!');
    return updatedCategory;
  }
}
