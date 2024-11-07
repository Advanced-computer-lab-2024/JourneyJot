/** @format */

import { Link } from "react-router-dom";

const ProductCard = ({ products = [] }) => {
  // Function to render stars based on rating
  const renderStars = (rating) => {
    const totalStars = 5;
    return (
      <div className="flex">
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

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.length > 0 ? (
        products.map((product) => (
          <div
            key={product._id}
            className="border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover:shadow-xl"
          >
            <div className="flex flex-col justify-between h-full">
              {/* Display product picture if available */}
              {product.picture && (
                <img
                  src={product.picture}
                  alt={product.name || "Product Image"}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <h2 className="text-xl font-bold mt-2">{product.name}</h2>
              <p className="text-gray-700">Details: {product.details}</p>
              <p className="text-gray-700">Price: ${product.price}</p>
              <p className="text-gray-700">Quantity: {product.quantity}</p>
              <p className="text-gray-700">Rating:</p>
              <div className="flex items-center">
                {renderStars(Math.round(product.rating) || 0)}{" "}
                {/* Render stars based on the rating */}
              </div>
              <Link to={`editProduct/${product._id}`}>
                <button className="bg-teal-500 rounded-md w-24 mt-2">
                  Edit
                </button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p>No products Available</p>
      )}
    </div>
  );
};

export default ProductCard;
