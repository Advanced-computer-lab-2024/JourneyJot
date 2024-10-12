/** @format */

import { useState } from "react";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productPicture, setProductPicture] = useState("");
  const [productRating, setProductRating] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSaveProduct = () => {
    const data = {
      name: productName,
      details: productDetails,
      price: parseFloat(productPrice), // Use parseFloat for price
      quantity: parseInt(productQuantity),
      picture: productPicture,
      rating: parseFloat(productRating), // Use parseFloat for rating
    };

    setLoading(true);
    axios
      .post("http://localhost:3000/products/addProduct", data)
      .then(() => {
        setLoading(false);
        navigate("/products");
      })
      .catch((err) => {
        setLoading(false);
        alert("Error, check console!");
        console.log(err.response.data);
      });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4">
      {loading && <Spinner />}
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="border-2 border-gray-500 rounded-lg px-4 py-2 relative hover:shadow-xl"
        />
        <input
          type="text"
          placeholder="Product Details"
          value={productDetails}
          onChange={(e) => setProductDetails(e.target.value)}
          className="border-2 border-gray-500 rounded-lg px-4 py-2 relative hover:shadow-xl"
        />
        <input
          type="text"
          placeholder="Price"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          className="border-2 border-gray-500 rounded-lg px-4 py-2 relative hover:shadow-xl"
        />
        <input
          type="text"
          placeholder="Quantity"
          value={productQuantity}
          onChange={(e) => setProductQuantity(e.target.value)}
          className="border-2 border-gray-500 rounded-lg px-4 py-2 relative hover:shadow-xl"
        />
        <input
          type="text"
          placeholder="Product Picture URL"
          value={productPicture}
          onChange={(e) => setProductPicture(e.target.value)}
          className="border-2 border-gray-500 rounded-lg px-4 py-2 relative hover:shadow-xl"
        />
        <input
          type="text"
          placeholder="Rating (0-5)"
          value={productRating}
          onChange={(e) => setProductRating(e.target.value)}
          className="border-2 border-gray-500 rounded-lg px-4 py-2 relative hover:shadow-xl"
        />
      </div>
      <div className="mt-4">
        <button
          className="bg-teal-500 text-white rounded-md px-6 py-2 shadow-md hover:bg-teal-600 transition duration-200"
          onClick={handleSaveProduct}
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
