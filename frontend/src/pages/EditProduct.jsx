import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ProductDetails, setProductDetails] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the product details
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/products/${id}`
        );
        setProductDetails(response.data.product.details);
        setProductPrice(response.data.product.price);
      } catch (err) {
        alert("error, check console!");
        console.log(err.response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleEditProduct = async () => {
    const data = {
      details: ProductDetails,
      price: parseInt(productPrice),
    };
    setLoading(true);
    try {
      await axios.put(`http://localhost:8000/products/${id}`, data);
      setLoading(false);
      navigate("/products");
    } catch (err) {
      setLoading(false);
      alert("error, check console!");
      console.log(err.response.data);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {loading ? <Spinner /> : ""}
      <div className="flex justify-center">
        <textarea
          type="text"
          placeholder="Product Details"
          value={ProductDetails}
          onChange={(e) => setProductDetails(e.target.value)}
          className="border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover: shadow-xl resize-none"
        />
        <input
          type="text"
          placeholder="Price"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          className="border-2 border-gray-500 rounded-lg px-4 py-2 m-4 relative hover: shadow-xl"
        />
      </div>
      <div>
        <button
          className="bg-teal-500 rounded-md px-6"
          onClick={handleEditProduct}
        >
          Save
        </button>
      </div>
    </div>
  );
};
export default EditProduct;
