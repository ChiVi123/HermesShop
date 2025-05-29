import { type WithId } from 'mongodb';
import slug from 'slug';
import type { CategoryModel } from '~/models/categoryModel';
import type { ProductModel } from '~/models/productModel';
import { CategoryModelRepository } from '~/repositories/implements/CategoryModelRepository';
import { ProductModelRepository } from '~/repositories/implements/ProductModelRepository';
import { SkuModelRepository } from '~/repositories/implements/SkuModelRepository';
import { PATH_PRODUCT_JSON, PATH_SKU_JSON } from './constants';
import type { Product, ProductInfoJSON, Sku, SkuJSON } from './types';
import { readDataFromJsonFile } from './utils';

const categoryRepository = new CategoryModelRepository();
const productRepository = new ProductModelRepository();
const skuRepository = new SkuModelRepository();

const PRODUCT_JSON = readDataFromJsonFile<ProductInfoJSON>(PATH_PRODUCT_JSON);
const SKU_JSON = readDataFromJsonFile<SkuJSON>(PATH_SKU_JSON);

export async function uploadDataCrawled(): Promise<void> {
  let productSavedCounter = 0;
  const productJSON = Object.values(PRODUCT_JSON);

  for (const { category, skuIds, ...data } of productJSON) {
    const skus = getAllSkuBySkuIdList(skuIds, SKU_JSON);
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

  logging.info('Product saved is', `${productSavedCounter}/${productJSON.length}`);
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
  data: Omit<Product, 'category' | 'skuIds'>,
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

function getAllSkuBySkuIdList(skuIds: string[], skuJSON: SkuJSON): Sku[] {
  return skuIds.map((id) => skuJSON[id]).flat();
}
