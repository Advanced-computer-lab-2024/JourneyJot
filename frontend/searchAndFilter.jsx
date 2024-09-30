import React, { useState } from 'react';
import axios from 'axios';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    // Search handler
    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/products/search?name=${searchTerm}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    // Filter handler
    const handleFilter = async () => {
        try {
            const response = await axios.get(`/api/products/filter?minPrice=${minPrice}&maxPrice=${maxPrice}`);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    return (
        <div>
            <h2>Search and Filter Products</h2>

            {/* Search Section */}
            <div>
                <input 
                    type="text" 
                    placeholder="Search by name" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <button onClick={handleSearch}>Search</button>
            </div>

            {/* Filter Section */}
            <div>
                <input 
                    type="number" 
                    placeholder="Min Price" 
                    value={minPrice} 
                    onChange={(e) => setMinPrice(e.target.value)} 
                />
                <input 
                    type="number" 
                    placeholder="Max Price" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(e.target.value)} 
                />
                <button onClick={handleFilter}>Filter</button>
            </div>

            {/* Product List */}
            <div>
                {products.length > 0 ? (
                    <ul>
                        {products.map((product) => (
                            <li key={product._id}>
                                <h3>{product.name}</h3>
                                <p>Price: ${product.price}</p>
                                <p>{product.description}</p>
                                <p>Ratings: {product.ratings}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
