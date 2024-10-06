const express = require("express");
const productRouter = express.Router();

const {
  getSorted,
  searchByName,
  filterByPrice,
  addProduct,
  editProductByID,
  getProductByID,
  getProducts,
} = require("../controllers/product");

productRouter.get("/sortProducts", getSorted);

productRouter.get("/searchProductByName", searchByName);

productRouter.get("/filterProductsByPrice", filterByPrice);

productRouter.post("/addProduct", addProduct);

productRouter.get("/", getProducts);

productRouter.put("/:id", editProductByID);

productRouter.get("/:id", getProductByID);

module.exports = productRouter;
