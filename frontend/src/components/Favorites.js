import React, { useState, useEffect } from 'react';
import './Favorites.css';

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const removeFavorite = (id) => {
    const updated = favorites.filter(fav => fav._id !== id);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  return (
    <div className="favorites">
      <h1>❤️ My Favorites</h1>
      {favorites.length === 0 ? (
        <p className="no-favorites">No favorites yet. Start adding products!</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map(product => (
            <div key={product._id} className="favorite-card">
              <h3>{product.name}</h3>
              <p className="source">{product.source}</p>
              <p className="price">₹{product.price}</p>
              <p className="rating">⭐ {product.rating}/5</p>
              <a href={product.link} target="_blank" rel="noopener noreferrer" className="link-btn">
                View Product
              </a>
              <button
                className="remove-btn"
                onClick={() => removeFavorite(product._id)}
              >
                Remove from Favorites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;