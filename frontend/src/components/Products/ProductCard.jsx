/** @format */

import { Link } from "react-router-dom";

const ProductCard = ({ products = [] }) => {
  console.log("Products passed to ProductCard:", products);

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
              <p className="text-gray-700">Rating: {product.rating || "N/A"}</p>
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
