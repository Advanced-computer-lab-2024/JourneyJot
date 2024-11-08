/** @format */

const express = require('express');
const { uploadImages, upload } = require('../controllers/upload');
const uploadRouter = express.Router();

uploadRouter.post('/', upload.single('image'), uploadImages);
module.exports = uploadRouter;
