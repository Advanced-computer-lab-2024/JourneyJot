import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
const ShowProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8000/products")
      .then((response) => {
        setProducts(response.data.products);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);
  return (
    <div className="p-4">
      <div className=" flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
      </div>
      {loading ? <Spinner /> : <ProductCard products={products} />}
    </div>
  );
};

export default ShowProducts;
