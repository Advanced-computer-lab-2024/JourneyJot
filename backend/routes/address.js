/** @format */

const express = require('express');
const addressRouter = express.Router();
const authMiddleware = require('../middleware/auth-check');
const { getAddress, addAddress } = require('../controllers/address');

addressRouter.post('/', authMiddleware, addAddress);
addressRouter.get('/', authMiddleware, getAddress);
module.exports = addressRouter;
