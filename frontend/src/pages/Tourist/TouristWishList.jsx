import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TouristWishList = () => {
  const [wishList, setWishList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishList = async () => {
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
          "http://localhost:3000/tourists/getWishList",
          config
        );
        setWishList(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : "Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchWishList();
  }, []);

  const removeFromWishList = async (productId) => {
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

      await axios.delete(
        `http://localhost:3000/tourists/removeFromWishList/${productId}`,
        config
      );

      setWishList((prevWishList) =>
        prevWishList.filter((product) => product._id !== productId)
      );
    } catch (err) {
      alert("Failed to remove product from wish list.");
    }
  };

  const addToCart = async (productId) => {
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

      await axios.post(
        `http://localhost:3000/tourists/addToCart/${productId}`,
        { quantity: 1 }, // Send quantity as 1 in the request body
        config
      );

      alert("Product added to cart successfully!");
    } catch (err) {
      alert("Failed to add product to cart.");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-5">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Wish List</h2>
      {wishList.length === 0 ? (
        <div className="text-center text-gray-500">
          Your wish list is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishList.map((product) => (
            <div
              key={product._id}
              className="relative border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() =>
                navigate(`/tourist/homePage/products/${product._id}`)
              }
            >
              <h3 className="text-xl font-medium">{product.name}</h3>
              <p className="text-gray-600 mt-2">
                Price: ${product.price.toFixed(2)}
              </p>
              <div className="mt-4 flex gap-x-3">
                <button
                  className="bg-green-500 text-white px-4 py-2 text-sm rounded shadow hover:bg-green-600"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation when clicking the button
                    addToCart(product._id);
                  }}
                >
                  Add to Cart
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 text-sm rounded shadow hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigation when clicking the button
                    removeFromWishList(product._id);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TouristWishList;
