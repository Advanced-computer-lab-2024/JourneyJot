/** @format */

const express = require('express');
const productRouter = express.Router();

const {
	getSorted,
	searchByName,
	filterByPrice,
	addProduct,
	editProductByID,
	getProductByID,
	getProducts,
	getTouristProducts,
} = require('../controllers/product');
const {
	archiveProduct,
	unarchiveProduct,
} = require('../controllers/archieve-product');
const authCheck = require('../middleware/auth-check');
const adminSeller = require('../middleware/admin-seller');

productRouter.get('/sortProducts', getSorted);

productRouter.get('/searchProductByName', searchByName);

productRouter.get('/filterProductsByPrice', filterByPrice);

productRouter.post('/addProduct', addProduct);

productRouter.get('/', authCheck, getProducts);

productRouter.get('/show', getTouristProducts);

productRouter.put('/:id', editProductByID);

productRouter.get('/:id', getProductByID);

productRouter.put('/archive/:id', archiveProduct);

productRouter.put('/unarchive/:id', unarchiveProduct);

module.exports = productRouter;
