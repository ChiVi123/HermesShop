import { type WithId } from 'mongodb';
import slug from 'slug';
import type { CategoryModel } from '~/models/categoryModel';
import type { ProductModel } from '~/models/productModel';
import { CategoryModelRepository } from '~/repositories/implements/CategoryModelRepository';
import { ProductModelRepository } from '~/repositories/implements/ProductModelRepository';
import { SkuModelRepository } from '~/repositories/implements/SkuModelRepository';
import { PATH_PRODUCT_JSON } from './constants';
import type { Product, ProductJSON, Sku } from './types';
import { readDataFromJsonFile } from './utils';

const categoryRepository = new CategoryModelRepository();
const productRepository = new ProductModelRepository();
const skuRepository = new SkuModelRepository();

const PRODUCT_CACHED: ProductJSON['products'] = readDataFromJsonFile<ProductJSON>(PATH_PRODUCT_JSON).products ?? [];

export async function uploadDataCrawled(): Promise<void> {
  let productSavedCounter = 0;

  for (const { category, ...data } of PRODUCT_CACHED) {
    const categoryCreated = await createCategory(category);
    if (!categoryCreated) {
      logging.danger('(uploadDataCrawled) category not found', categoryCreated);
      continue;
    }

    const productCreated = await createProduct(data, categoryCreated);
    if (productCreated === undefined) {
      logging.danger('(uploadDataCrawled) continue save another product');
      continue;
    }
    if (productCreated === null) {
      logging.danger('(uploadDataCrawled) product not found');
      continue;
    }

    const productResult = await createManySkus(productCreated._id.toString(), skus);
    if (!productResult) {
      logging.danger('(uploadDataCrawled) product not found', productResult);
      continue;
    }

    productSavedCounter++;
    logging.info('Uploaded', productResult.name, 'sku counter:', productResult.skuIds.length);
  }

  logging.info('Product saved is', `${productSavedCounter}/${PRODUCT_CACHED.length}`);
}

// Methods
async function createCategory(name: string): Promise<WithId<CategoryModel> | null> {
  const existCategory = await categoryRepository.findOneByName(name);
  if (existCategory) {
    logging.info(`(createCategory) Category has name="${name}" already exists!`);
    return existCategory;
  }

  const insertedOneResult = await categoryRepository.insertOne({ name, slugify: slug(name) });
  return categoryRepository.findOneById(insertedOneResult.insertedId);
}

async function createProduct(
  data: Omit<Product, 'category' | 'skus'>,
  category: WithId<CategoryModel>,
): Promise<WithId<ProductModel> | undefined | null> {
  const existProduct = await productRepository.findOneByName(data.name);
  if (existProduct) {
    logging.info(`Product name="${data.name}" already exists!`);
    return undefined;
  }

  const insertedOneResult = await productRepository.insertOne({
    ...data,
    categoryId: category._id.toString(),
    slugify: slug(data.name),
  });
  return productRepository.findOneById(insertedOneResult.insertedId);
}

async function createManySkus(productId: string, skus: Sku[]): Promise<WithId<ProductModel> | null> {
  const insertManyResult = await skuRepository.createMany(
    skus.map((sku) => ({
      ...sku,
      productId,
    })),
  );

  return productRepository.pushSkuIds(productId, Object.values(insertManyResult.insertedIds));
}
