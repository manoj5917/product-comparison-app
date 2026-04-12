import React, { useState } from 'react';
import ComparisonTable from './components/ComparisonTable';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const fetchProducts = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a product name');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/products?search=${searchTerm}`);
      const data = await response.json();
      
      if (data.length === 0) {
        setError('No products found. Try another search.');
      }
      setProducts(data);
    } catch (err) {
      setError('Error fetching products. Make sure backend is running.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchProducts();
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>🛍️ Product Comparison</h1>
        <p>Compare products from Amazon & Flipkart</p>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search products (e.g., Laptop, Phone)..."
          value={searchTerm}
          onChange={handleSearch}
          onKeyPress={handleKeyPress}
        />
        <button onClick={fetchProducts} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {products.length > 0 && (
        <div className="results-summary">
          <p>Found <strong>{products.length}</strong> products</p>
        </div>
      )}

      <div className="products-container">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p className="source">{product.source}</p>
            <p className="price">${product.price}</p>
            <p className="rating">⭐ {product.rating}/5</p>
            <a href={product.link} target="_blank" rel="noopener noreferrer">
              View Product →
            </a>
          </div>
        ))}
      </div>

      {products.length > 0 && <ComparisonTable products={products} />}
    </div>
  );
}

export default App;