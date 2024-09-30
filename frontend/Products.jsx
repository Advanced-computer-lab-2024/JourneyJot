import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/Product');//asebha product el mn el backend wala Products mn el routes???
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;
  
//fi images le line 34???
  return (
    <div className="product-list">
      <h2>Available Products</h2>
      <div className="product-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <img src={product.imageUrl} alt={product.name} className="product-image" /> 
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: ${product.price}</p>
              <p>Available Quantity: {product.quantity}</p>
              <p>Ratings: {product.ratings ? product.ratings : 'No ratings yet'}</p>
              <p>Reviews: {product.reviews.length > 0 ? product.reviews.join(', ') : 'No reviews'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
