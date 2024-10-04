const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// posting a new product
router.post("/", async (req, res) => {
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
