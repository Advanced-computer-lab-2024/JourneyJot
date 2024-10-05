const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

const isAuthorized = (req, res, next) => {
  const { role } = req.user;
  if (role === "Admin" || role === "Tourist" || role === "Seller") {
    next();
  } else {
    res.status(403).json({ message: "Access denied." });
  }
};

router.get("/getAllProducts", isAuthorized, async (req, res) => {
  // <- Middleware applied correctly
  try {
    const products = await Product.find({});
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/searchProductByName", isAuthorized, async (req, res) => {
  // <- Added middleware here as well
  const { productName } = req.query;
  try {
    const products = await Product.find({
      name: { $regex: productName, $options: "i" },
    });
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/filterProductsByPrice", isAuthorized, async (req, res) => {
  // <- Added middleware here as well
  const { minPrice, maxPrice } = req.query;
  try {
    const products = await Product.find({
      price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) },
    });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in this price range" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/addProduct", isAuthorized, async (req, res) => {
  // <- Added middleware here as well
  try {
    const product = new Product({
      details: req.body.details,
      price: req.body.price,
      quantity: req.body.quantity,
      rating: req.body.rating,
    });
    await product.save();
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// getting all products sorted by rating
router.get("/", isAuthorized, async (req, res) => {
  // <- Added middleware here as well
  try {
    const products = await Product.find().sort({ rating: 1 });
    res.status(200).json({ products });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// editing a product by id
router.put("/:id", isAuthorized, async (req, res) => {
  // <- Added middleware here as well
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // checking if details were passed in the request
      if (req.body.details) product.details = req.body.details;
      // checking if price was passed in the request
      if (req.body.price) product.price = req.body.price;
      await product.save();
      res.status(200).json({
        message: "Product updated successfully",
        product,
      });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
