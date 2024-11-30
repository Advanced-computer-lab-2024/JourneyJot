import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // To navigate to the checkout page

const API_URL = "http://localhost:3000"; // Backend API base URL

const TouristCart = () => {
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

        const response = await axios.get(`${API_URL}/tourists/getCart`, config);
        setCartItems(response.data); // Set populated cart items
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = async (productId, change) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const item = cartItems.find((item) => item.productId._id === productId);
      const newQuantity = item.quantity + change;
  
      if (newQuantity < 1) return; // Ensure quantity is at least 1
  
      // Call the backend to update the quantity
      const response = await axios.put(
        `${API_URL}/tourists/cart/update/${productId}`,
        { quantity: newQuantity },
        config
      );
  
      // Update the state using the functional form to avoid stale state
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };
  

  const removeProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      // Call the backend to remove the product
      await axios.delete(`${API_URL}/tourists/cart/remove/${productId}`, config);
  
      // Update the state using the functional form
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.productId._id !== productId)
      );
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };
  

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item?.productId?.price || 0; // Ensure price is defined
      const quantity = item?.quantity || 0; // Ensure quantity is defined
      return total + price * quantity;
    }, 0).toFixed(2); // Format to 2 decimal places
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
              key={item.productId._id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.productId.picture}
                  alt={item.productId.name}
                  className="w-16 h-16 object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.productId.name}</h2>
                  <p className="text-gray-500">${item.productId.price}</p>
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
          to="/tourist/homePage/products/checkout"
          className="bg-teal-500 text-white px-8 py-3 rounded-md hover:bg-teal-600"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
};

export default TouristCart;
