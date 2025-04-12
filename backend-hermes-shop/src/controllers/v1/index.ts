import AuthController from '~/controllers/v1/AuthController';
import CategoryController from '~/controllers/v1/CategoryController';
import ProductController from '~/controllers/v1/ProductController';
import TestController from '~/controllers/v1/TestController';

const v1Controllers = [TestController, AuthController, ProductController, CategoryController];

export default v1Controllers;
