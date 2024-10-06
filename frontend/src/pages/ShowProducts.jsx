import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
const ShowProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search


  useEffect(() => {
    setLoading(true);
    if (!sort) {
      axios
        .get("http://localhost:8000/products")
        .then((response) => {
          setProducts(response.data.products);
          console.log("Fetched products:", response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setLoading(false);
        });
    }
    if (sort) {
      axios
        .get("http://localhost:8000/products/sortProducts")
        .then((response) => {
          setProducts(response.data.products);
          console.log("Fetched products:", response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
          setLoading(false);
        });
    }
  }, [sort]);

  const filterByPrice = () => {
    setLoading(true);
    axios
      .get("http://localhost:8000/products/filterProductsByPrice", {
        params: { minPrice: minPrice, maxPrice: maxPrice },
      })
      .then((response) => {
        setProducts(response.data.products);
        console.log("Fetched products:", response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  };

  const searchByName = () => {
    setLoading(true);
    axios
      .get("http://localhost:8000/products/searchProductByName", {
        params: { productName: searchQuery },
      })
      .then((response) => {
        setProducts(response.data.products);
        console.log("Searched products:", response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error searching products: ", error);
        setLoading(false);
      });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
      </div>
      <div className="flex space-x-4">
        {/* New Search Field */}
        <input
          type="text"
          placeholder="Search by product name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-2 border-gray-500 rounded-lg p-2"
        />
        <button
          onClick={searchByName}
          className="bg-teal-500 rounded-md px-4 w-24"
        >
          Search
        </button>
      </div>

      <div>{loading ? <Spinner /> : <ProductCard products={products} />}</div>
      <div className="flex justify-end items-center space-x-4">
        <Link to={"addProduct"}>
          <button className="flex bg-teal-500 rounded-md px-6">
            Add Product
          </button>
        </Link>

        <button
          className="bg-teal-500 rounded-md px-6"
          onClick={() => setSort((prevState) => !prevState)}
        >
          Sort By Rating
        </button>
        <div className="flex items-center space-x-2">
          <input
            placeholder="min price"
            className="border-2 border-gray-500 rounded-lg m-4 relative hover:shadow-xl w-32"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          ></input>
          <input
            placeholder="max price"
            className="border-2 border-gray-500 rounded-lg m-4 relative hover:shadow-xl w-32"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          ></input>
          <button
            onClick={filterByPrice}
            className="bg-teal-500 rounded-md px-4 w-24"
          >
            Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowProducts;
