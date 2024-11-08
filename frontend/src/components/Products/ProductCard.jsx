/** @format */

import { Link } from "react-router-dom";

const ProductCard = ({ products = [] }) => {
  // Function to render stars based on rating
  const renderStars = (rating) => {
    const totalStars = 5;
    return (
      <div className="flex space-x-1">
        {Array.from({ length: totalStars }, (_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${
              index < rating ? "text-yellow-400" : "text-gray-300"
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

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4">
      {products.length > 0 ? (
        products.map((product) => (
          <div
            key={product._id}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300"
          >
            <div className="flex flex-col h-full bg-white">
              {/* Display product picture if available */}
              {product.picture && (
                <img
                  src={product.picture}
                  alt={product.name || "Product Image"}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2">
                    {product.details}
                  </p>
                  <p className="text-sm text-gray-700 font-medium">
                    Price:{" "}
                    <span className="text-green-500">${product.price}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Quantity: {product.quantity}
                  </p>
                  <div className="flex items-center mt-2">
                    {renderStars(Math.round(product.rating) || 0)}
                  </div>
                </div>
                <Link to={`editProduct/${product._id}`} className="mt-4">
                  <button className="w-full bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition duration-200">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 text-lg">
          No products available
        </p>
      )}
    </div>
  );
};

export default ProductCard;
