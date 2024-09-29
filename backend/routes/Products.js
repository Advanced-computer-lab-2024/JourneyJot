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
router.get('/all', isAuthorized, async (req, res) => {
  try {
    const products = await Product.find().populate('sellerId', 'name').exec(); //msh mota2aked hangeeb el prodects mn el seller ID?
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

//83
router.get('/search', isAuthorized, async (req, res) => {
    const { name } = req.query;

    try {
      const products = await Product.find({
        name: { $regex: name, $options: 'i' }
      }).populate('sellerId', 'name').exec();

      if (products.length > 0) {
        res.json(products);
      } else {
        res.status(404).json({ message: 'No products found matching the query.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to search products.' });
    }
  });

module.exports = router;