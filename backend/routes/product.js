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
const { uploadProductImage } = require('../controllers/products-img');
const upload = require('../middleware/imgs');

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

productRouter.post(
	'/:productId/upload',
	upload.single('picture'),
	uploadProductImage
);
// Serve a specific image by filename

module.exports = productRouter;
