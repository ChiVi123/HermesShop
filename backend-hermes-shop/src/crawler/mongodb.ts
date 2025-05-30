import type { InsertManyResult, ObjectId, WithId } from 'mongodb';
import slug from 'slug';
import type { CategoryModel } from '~/models/categoryModel';
import type { ProductModel, ProductVariantModel } from '~/models/productModel';
import { CategoryModelRepository } from '~/repositories/implements/CategoryModelRepository';
import { ImageModelRepository } from '~/repositories/implements/ImageModelRepository';
import { ProductModelRepository } from '~/repositories/implements/ProductModelRepository';
import { ProductVariantModelRepository } from '~/repositories/implements/ProductVariantModelRepository';
import { PATH_PRODUCT_JSON, PATH_VARIANT_JSON } from './constants';
import type { Product, ProductJSON, ProductVariant, ProductVariantJSON } from './types';
import { readDataFromJsonFile } from './utils';

type ProductVariantTransformed = Omit<ProductVariant, 'images'> & { imageIds: string[] | ObjectId[] };

const categoryRepository = new CategoryModelRepository();
const productRepository = new ProductModelRepository();
const productVariantRepository = new ProductVariantModelRepository();
const imageRepository = new ImageModelRepository();

const PRODUCT_JSON = readDataFromJsonFile<ProductJSON>(PATH_PRODUCT_JSON);
const PRODUCT_VARIANT_JSON = readDataFromJsonFile<ProductVariantJSON>(PATH_VARIANT_JSON);

export async function uploadDataCrawled(): Promise<void> {
  let productSavedCounter = 0;
  const productJSON = Object.values(PRODUCT_JSON);

  for (const { category, variantIds, ...data } of productJSON) {
    const variants = getAllProductVariantByIds(variantIds, PRODUCT_VARIANT_JSON);
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

    logging.info('Product saved', productCreated._id);

    const variantTransformedList = await setImageIds(variants);
    const productVariantResult = await createManyProductVariant(productCreated._id.toString(), variantTransformedList);

    productSavedCounter++;
    logging.info('Product variant saved:', `(${productCreated.name}):${productVariantResult.insertedCount}`);
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
  data: Omit<Product, 'category' | 'variantIds'>,
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

async function createManyProductVariant(
  productId: string,
  variants: ProductVariantTransformed[],
): Promise<InsertManyResult<ProductVariantModel>> {
  return productVariantRepository.createMany(
    variants.map((productVariant) => ({
      ...productVariant,
      productId,
    })),
  );
}

function getAllProductVariantByIds(variantIds: string[], productVariantJSON: ProductVariantJSON): ProductVariant[] {
  return variantIds.map((id) => productVariantJSON[id]);
}

async function setImageIds(variants: ProductVariant[]): Promise<ProductVariantTransformed[]> {
  const result: ProductVariantTransformed[] = [];

  for (const { images, ...data } of variants) {
    const imageIds: string[] = [];

    for (const item of images) {
      if (typeof item === 'string') continue;

      const image = await imageRepository.findOneByPublicId(item.publicId);
      if (!image) continue;

      imageIds.push(image._id.toString());
    }

    result.push({ ...data, imageIds });
  }
  return result;
}
