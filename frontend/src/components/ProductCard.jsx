import React from "react";
import { Link } from "react-router-dom";
// details , price, quantity, rating
const ProductCard = ({ products = [] }) => {
  console.log("Products passed to ProductCard:", products);
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.length > 0 ? (
        products.map((products) => (
          <div
            key={products._id}
            className="border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover: shadow-xl"
          >
            <div className="flex flex-col justify-between h-full">
              <h2 className="text-xl font-bold">{products.details}</h2>
              <p className="text-gray-700">Price: ${products.price}</p>
              <p className="text-gray-700">Quantity: {products.quantity}</p>
              <p className="text-gray-700">Rating: {products.rating}</p>
              <Link to={`editProduct/${products._id}`}>
                <button className="bg-teal-500 rounded-md w-24 mt-2">
                  edit
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
