/** @format */

import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { Link } from "react-router-dom";
import TouristProductCard from "../components/TouristProductCard";

const TouristProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState(false);
  const [searchedProduct, setSearchedProduct] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/products");
      setProducts(response.data.products);
      console.log("Fetched products:", response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // sort and unsort products
    setLoading(true);
    if (!sort) {
      fetchProducts();
    } else {
      axios
        .get("http://localhost:3000/products/sortProducts")
        .then((response) => {
          setProducts(response.data.products);
          console.log("Fetched sorted products:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        })
        .finally(() => setLoading(false));
    }
  }, [sort]);

  const filterByPrice = () => {
    setLoading(true);
    axios
      .get("http://localhost:3000/products/filterProductsByPrice", {
        params: { minPrice: minPrice, maxPrice: maxPrice },
      })
      .then((response) => {
        setProducts(response.data.products);
        console.log("Filtered products by price:", response.data);
      })
      .catch((error) => {
        console.error("Error filtering data: ", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // handle if user is searching for something
    if (searchedProduct.trim()) {
      setLoading(true);
      axios
        .get("http://localhost:3000/products/searchProductByName", {
          params: { productName: searchedProduct },
        })
        .then((response) => {
          setProducts(response.data.products);
          console.log("Fetched searched products:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        })
        .finally(() => setLoading(false));
    } else {
      fetchProducts();
    }
  }, [searchedProduct]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-teal-600">Products</h1>
        <input
          type="search"
          placeholder="Search..."
          value={searchedProduct}
          onChange={(e) => setSearchedProduct(e.target.value)}
          className="mt-4 md:mt-0 w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>
      <div className="mb-4">
        {loading ? <Spinner /> : <TouristProductCard products={products} />}
      </div>
      <div className="flex flex-col md:flex-row justify-end items-center">
        <button
          className="bg-teal-500 text-white rounded-md px-6 py-2 mt-4 md:mt-0 shadow-md hover:bg-teal-600 transition duration-200"
          onClick={() => setSort((prevState) => !prevState)}
        >
          Sort By Rating
        </button>
      </div>
      <div className="flex flex-col md:flex-row items-center mt-4">
        <input
          placeholder="Min Price"
          className="border border-gray-300 rounded-lg m-2 p-2 w-full md:w-1/4 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          placeholder="Max Price"
          className="border border-gray-300 rounded-lg m-2 p-2 w-full md:w-1/4 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button
          onClick={filterByPrice}
          className="bg-teal-500 text-white rounded-md px-4 py-2 mt-4 md:mt-0 shadow-md hover:bg-teal-600 transition duration-200 w-full md:w-1/4"
        >
          Filter
        </button>
      </div>
    </div>
  );
};

export default TouristProducts;
