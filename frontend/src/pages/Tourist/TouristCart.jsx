import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // To navigate to the checkout page

const TouristCart = () => {
  // State to store the cart items and total
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the cart from the backend
  useEffect(() => {
    const fetchCart = async () => {
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

        // Fetch the tourist data including cart items and product details
        const response = await axios.get(
          "http://localhost:3000/tourists/getCart",
          config
        );

        // The response will already contain populated cart items
        setCartItems(response.data); // Directly set populated cart items
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Update the quantity of a product
  const updateQuantity = (productId, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId._id === productId
          ? { ...item, quantity: item.quantity + change }
          : item
      )
    );
  };

  // Remove a product from the cart
  const removeProduct = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId._id !== productId)
    );
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-teal-600 mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.productId._id} // Use productId._id as the unique key
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.productId.picture} // Access the product's picture
                  alt={item.productId.name} // Access the product's name
                  className="w-16 h-16 object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {item.productId.name}
                  </h2>{" "}
                  {/* Access the product's name */}
                  <p className="text-gray-500">${item.productId.price}</p>{" "}
                  {/* Access the product's price */}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => updateQuantity(item.productId._id, -1)}
                  disabled={item.quantity <= 1}
                  className="bg-teal-500 text-white p-2 rounded-md"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId._id, 1)}
                  className="bg-teal-500 text-white p-2 rounded-md"
                >
                  +
                </button>
                <button
                  onClick={() => removeProduct(item.productId._id)}
                  className="bg-red-500 text-white p-2 rounded-md"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Display total price */}
      <div className="mt-6 text-right">
        <p className="text-lg font-semibold">Total: ${getTotalPrice()}</p>
      </div>

      {/* Checkout Button */}
      <div className="mt-6 text-center">
        <Link
          to="/tourist/homePage/products/checkout" // Navigate to checkout page
          className="bg-teal-500 text-white px-8 py-3 rounded-md hover:bg-teal-600"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default TouristCart;
