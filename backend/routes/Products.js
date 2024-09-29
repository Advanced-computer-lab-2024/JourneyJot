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

router.get('/all', isAuthorized, async (req, res) => {
  try {
    const products = await Product.find().populate('sellerId', 'name').exec(); //msh mota2aked hangeeb el prodects mn el seller ID?
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

module.exports = router;
