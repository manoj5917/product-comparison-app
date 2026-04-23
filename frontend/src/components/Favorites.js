import React, { useState, useEffect } from 'react';
import './Favorites.css';

function Favorites({ user }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/favorites', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch favorites');
      const data = await response.json();
      setFavorites(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/favorites/remove/${productId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to remove from favorites');
      setFavorites(favorites.filter(p => p._id !== productId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) {
    return <div className="favorites-container"><p>Please login to view favorites</p></div>;
  }

  if (loading) return <div className="favorites-container"><p>Loading...</p></div>;

  return (
    <div className="favorites-container">
      <h2>My Favorites</h2>
      {error && <div className="error-message">{error}</div>}
      {favorites.length === 0 ? (
        <p className="no-favorites">No favorites yet. Add some products!</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((product) => (
            <div key={product._id} className="favorite-card">
              <h3>{product.name}</h3>
              <p className="source">{product.source}</p>
              <p className="price">${product.price}</p>
              <p className="rating">⭐ {product.rating}/5</p>
              <div className="actions">
                <a href={product.link} target="_blank" rel="noopener noreferrer">
                  View Product
                </a>
                <button onClick={() => removeFavorite(product._id)} className="remove-btn">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;