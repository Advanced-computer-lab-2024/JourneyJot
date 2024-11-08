import React, { useState, useEffect } from "react";
import axios from "axios";

// StarRating Component for handling the star-based rating
const StarRating = ({ rating, onChange }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex">
      {stars.map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`w-6 h-6 cursor-pointer ${
            star <= rating ? "text-yellow-500" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
          onClick={() => onChange(star)}
        >
          <path d="M10 15.27l4.18 2.73-1.64-5.09L18 9.24l-5.19-.42L10 3 7.19 8.82 2 9.24l3.46 3.67-1.64 5.09L10 15.27z" />
        </svg>
      ))}
    </div>
  );
};

const PurchaseHistory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Fetch purchase history data
  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please login again.");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          "http://localhost:3000/tourists/productHistory",
          config
        );
        setProducts(response.data.products);
      } catch (error) {
        setError("Error fetching purchase history. Please try again.");
        console.error("Error fetching purchase history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, []);

  // Open modal for adding a review
  const openModal = (productId) => {
    setCurrentProductId(productId);
    setModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false);
    setRating(0);
    setComment("");
  };

  // Handle review submission (for now just log the values)
  const handleReviewSubmit = async () => {
    try {
      // Fetch the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please login again.");
      }

      // Configure headers to include the token in the Authorization header
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      console.log("bahebk");
      // Make the POST request to the server
      const response = await axios.post(
        "http://localhost:3000/tourists/review", // Replace with your actual review endpoint
        {
          productId: currentProductId,
          comment,
          rating,
        },
        config
      );

      // Handle success response
      console.log("Review submitted successfully:", response.data);
      closeModal(); // Close the modal after submission

      // Optionally, you can update the UI or show a success message
    } catch (error) {
      console.error("Error submitting review:", error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Purchase History</h1>

      {/* Loading, Error, and Product List Rendering */}
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : products.length === 0 ? (
        <p>No products purchased.</p>
      ) : (
        <ul className="space-y-6">
          {products.map((product) => (
            <li
              key={product._id}
              className="flex items-center justify-between bg-white p-4 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
            >
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-teal-600">
                  {product.name}
                </h2>
                <p className="text-gray-700 mt-2">{product.details}</p>
              </div>
              <button
                onClick={() => openModal(product._id)}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition duration-200"
              >
                Add Review
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal for Adding Review */}
      {modalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold mb-4">Add Review</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Rating</label>
              <StarRating rating={rating} onChange={setRating} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Write your comment here"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-800 transition duration-200"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
