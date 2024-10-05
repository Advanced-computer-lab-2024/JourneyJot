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

//81
router.get("/all", isAuthorized, async (req, res) => {
  try {
    const products = await Product.find().populate("sellerId", "name").exec(); //msh mota2aked hangeeb el prodects mn el seller ID?
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

//83
router.get("/search", isAuthorized, async (req, res) => {
  const { name } = req.query;

  try {
    const products = await Product.find({
      name: { $regex: name, $options: "i" },
    })
      .populate("sellerId", "name")
      .exec();

    if (products.length > 0) {
      res.json(products);
    } else {
      res
        .status(404)
        .json({ message: "No products found matching the query." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to search products." });
  }
});

// posting a new product
router.post("/addProduct", async (req, res) => {
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
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ rating: 1 });
    res.status(200).json({ products });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// eddting a product by id
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      // checking if details was passed in the request
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
