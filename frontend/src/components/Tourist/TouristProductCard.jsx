/** @format */

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// Main ProductCard Component
const ProductCard = ({ products = [], currency, conversionRate = 1 }) => {
  const navigate = useNavigate();
  // Render star ratings based on product rating
  const renderStars = (rating) => {
    const totalStars = 5; // Maximum number of stars
    return (
      <div className="flex space-x-1">
        {Array.from({ length: totalStars }, (_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${
              index < rating ? "text-yellow-500" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927a1 1 0 011.902 0l1.715 4.801a1 1 0 00.95.69h5.033a1 1 0 01.612 1.79l-4.07 2.959a1 1 0 00-.364 1.118l1.715 4.801a1 1 0 01-1.536 1.118L10 15.347l-4.365 3.171a1 1 0 01-1.536-1.118l1.715-4.801a1 1 0 00-.364-1.118L1.38 9.208a1 1 0 01.612-1.79h5.033a1 1 0 00.95-.69l1.715-4.801z" />
          </svg>
        ))}
      </div>
    );
  };

  // Main return block
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* Check if there are products to display */}
      {products.length > 0 ? (
        products.map((product) => (
          <Link
            key={product._id}
            to={`/tourist/homePage/products/${product._id}`}
            className="group border-2 border-gray-300 rounded-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <div className="flex flex-col justify-between h-full p-4">
              {/* Product Image */}
              {product.picture ? (
                <img
                  src={`http://localhost:3000/photos/${product.picture}`}
                  alt={product.name || "Product Image"}
                  className="w-full h-48 object-cover rounded-lg mb-4 group-hover:opacity-80 transition-opacity"
                />
              ) : (
                <div className="w-full h-48 bg-gray-300 flex justify-center items-center rounded-lg mb-4">
                  <span className="text-gray-600">No Image Available</span>
                </div>
              )}

              {/* Product Details */}
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {product.name}
              </h2>
              <p className="text-gray-600 text-sm mb-2">{product.details}</p>
              <p className="text-gray-800 font-medium mb-2">
                Price: {(product.price * conversionRate).toFixed(2)} {currency}
              </p>
              <p className="text-gray-800 font-medium mb-2">
                Quantity: {product.quantity}
              </p>

              {/* Rating */}
              <div className="flex items-center text-sm text-gray-700">
                <p className="mr-2">Rating:</p>
                {renderStars(Math.round(product.rating || 0))}
              </div>
            </div>
          </Link>
        ))
      ) : (
        /* Fallback if no products are available */
        <p className="col-span-full text-center text-gray-500">
          No products available
        </p>
      )}
    </div>
  );
};

export default ProductCard;
