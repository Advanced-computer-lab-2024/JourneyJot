// controllers/reviewController.js
const Review = require("../models/Review");
const Product = require("../models/Product");

const createReview = async (productId, userId, rating, comment) => {
  try {
    // Create a new review
    const review = new Review({
      rating,
      comment,
      product: productId,
    });

    await review.save();

    // Find the product and add the review ID to the reviews array
    const product = await Product.findById(productId);

    if (product) {
      product.reviews.push(review._id); // Add the review ID to the product's reviews array
      await product.save(); // Save the updated product
      await product.calculateAverageRating(); // Recalculate and save the new average rating
    }
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

module.exports = { createReview };
