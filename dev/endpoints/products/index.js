import basicRoute from '../../setup/basicRoute.js';
import {Schema, Products} from './model.js';
import {config} from '../../setup/config.js';

var products = Object.create(basicRoute);
products = Object.assign(products, {route: 'products', db: Products}, config);

export default products;
