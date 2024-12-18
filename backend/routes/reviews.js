const express = require("express");
const router = express.Router();

const { createReview } = require("../controllers/reviews");

router.post("/", createReview);

module.exports = router;
