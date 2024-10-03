import React from "react";
import { Link } from "react-router-dom";
// details , price, quantity, rating
const ProductCard = ({ prodcuts = [] }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {prodcuts.length > 0 ? (
        prodcuts.map((product) => (
          <div
            key={product._id}
            className="border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover: shadow-xl"
          >
            <h2 className="text-xl font-bold">{product.details}</h2>
            <p className="text-gray-700">Price: ${product.price}</p>
            <p className="text-gray-700">Quantity: {product.quantity}</p>
            <p className="text-gray-700">Rating: {product.rating}</p>
          </div>
        ))
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default ProductCard;
