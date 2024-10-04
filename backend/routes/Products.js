const express = require('express');
const Product = require('../models/Product');
const router = express.Router();


const isAuthorized = (req, res, next) => {
  const { role } = req.user;
  if (role === 'Admin' || role === 'Tourist' || role === 'Seller') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied.' });
  }
};

//81
const getAllProducts = async (req, res) => {
    if (!isAuthorized(req, res, ['Admin', 'Seller','Tourist'])) return;
    try {
        const products = await Product.find({});
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//83
const searchProductByName = async (req, res) => {
    const { productName } = req.query;
    try {
        const products = await Product.find({ name: { $regex: productName, $options: "i" } });
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
  
  //84
const filterProductsByPrice = async (req, res) => {
    const { minPrice, maxPrice } = req.query;
    try {
        const products = await Product.find({
            price: { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) }
        });
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found in this price range" });
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
module.exports = { getAllProducts, searchProductByName, filterProductsByPrice };