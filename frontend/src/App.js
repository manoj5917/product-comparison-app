import React, { useState } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products?search=${searchTerm}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <div className="App">
      <h1>Product Comparison</h1>
      <div className="search-container">
        <input type="text" placeholder="Search products..." value={searchTerm} onChange={handleSearch} />
        <button onClick={fetchProducts}>Search</button>
      </div>
      <div className="products-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <p>Source: {product.source}</p>
            <a href={product.link} target="_blank" rel="noopener noreferrer">View Product</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;