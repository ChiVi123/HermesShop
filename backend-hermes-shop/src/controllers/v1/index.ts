import AuthController from '~/controllers/v1/AuthController';
import CategoryController from '~/controllers/v1/CategoryController';
import ProductController from '~/controllers/v1/ProductController';
import TestController from '~/controllers/v1/TestController';
import UserController from '~/controllers/v1/UserController';

const v1Controllers = [AuthController, CategoryController, ProductController, TestController, UserController];

export default v1Controllers;
