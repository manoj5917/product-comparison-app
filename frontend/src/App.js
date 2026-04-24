import React, { useEffect, useMemo, useState } from 'react';
import ComparisonTable from './components/ComparisonTable';
import './App.css';

const formatCurrency = (value) => {
  const n = Number(value);
  if (Number.isNaN(n)) return value;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
};

const toNum = (v, fallback = Infinity) => {
  const n = Number(v);
  return Number.isNaN(n) ? fallback : n;
};

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(() => {
  const q = new URLSearchParams(window.location.search).get('q');
  return q ? q : '';
});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // New: filter + sort
  const [sourceFilter, setSourceFilter] = useState('All'); // All | Amazon | Flipkart
  const [sortBy, setSortBy] = useState('best'); // best | priceAsc | priceDesc | ratingDesc

  const handleSearch = (e) => setSearchTerm(e.target.value);

const copyShareLink = async () => {
  const q = searchTerm.trim();
  const url = new URL(window.location.href);

  if (q) url.searchParams.set('q', q);
  else url.searchParams.delete('q');

  const shareUrl = url.toString();

  try {
    await navigator.clipboard.writeText(shareUrl);
    setError('Link copied to clipboard!');
    setTimeout(() => setError(''), 1500);
  } catch {
    // Fallback if clipboard API is blocked
    window.prompt('Copy this link:', shareUrl);
  }
};

  const fetchProducts = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a product name');
      return;
    }

    setLoading(true);
    setError('');
    setProducts([]);

    try {
const url = new URL(window.location.href);
url.searchParams.set('q', searchTerm.trim());
window.history.replaceState({}, '', url);
      const response = await fetch(
        `http://localhost:5000/api/products?search=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        setError('No products found. Try another search.');
        setProducts([]);
        return;
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
    if (e.key === 'Enter') fetchProducts();
  };

useEffect(() => {
  const q = new URLSearchParams(window.location.search).get('q');
  if (q && q.trim() && products.length === 0 && !loading) {
    fetchProducts();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const productsWithKey = useMemo(() => {
    return (products ?? []).map((p) => ({
      ...p,
      _key: p.id ?? `${p.name}-${p.source}-${p.link}`,
    }));
  }, [products]);

  // Winner logic + baselines for deltas
  const { bestPriceId, bestRatingId, bestPriceValue, bestRatingValue } = useMemo(() => {
    if (!productsWithKey.length) {
      return { bestPriceId: null, bestRatingId: null, bestPriceValue: null, bestRatingValue: null };
    }

    let minPrice = Infinity;
    let maxRating = -Infinity;
    let minPriceId = null;
    let maxRatingId = null;

    for (const p of productsWithKey) {
      const price = toNum(p.price, Infinity);
      const rating = toNum(p.rating, NaN);

      if (price < minPrice) {
        minPrice = price;
        minPriceId = p._key;
      }
      if (!Number.isNaN(rating) && rating > maxRating) {
        maxRating = rating;
        maxRatingId = p._key;
      }
    }

    return {
      bestPriceId: minPriceId,
      bestRatingId: maxRatingId,
      bestPriceValue: Number.isFinite(minPrice) ? minPrice : null,
      bestRatingValue: Number.isFinite(maxRating) ? maxRating : null,
    };
  }, [productsWithKey]);

  // Apply filter + sort for UI (cards + table)
  const visibleProducts = useMemo(() => {
    let list = [...productsWithKey];

    if (sourceFilter !== 'All') {
      list = list.filter((p) => String(p.source).toLowerCase() === sourceFilter.toLowerCase());
    }

    const byPriceAsc = (a, b) => toNum(a.price) - toNum(b.price);
    const byPriceDesc = (a, b) => toNum(b.price) - toNum(a.price);
    const byRatingDesc = (a, b) => toNum(b.rating, -Infinity) - toNum(a.rating, -Infinity);

    if (sortBy === 'priceAsc') list.sort(byPriceAsc);
    else if (sortBy === 'priceDesc') list.sort(byPriceDesc);
    else if (sortBy === 'ratingDesc') list.sort(byRatingDesc);
    else if (sortBy === 'best') {
      // Best = best price first, then best rating, then rest
      list.sort((a, b) => {
        const aBest = a._key === bestPriceId ? 2 : a._key === bestRatingId ? 1 : 0;
        const bBest = b._key === bestPriceId ? 2 : b._key === bestRatingId ? 1 : 0;
        return bBest - aBest;
      });
    }

    return list;
  }, [productsWithKey, sourceFilter, sortBy, bestPriceId, bestRatingId]);

  const skeletons = useMemo(() => Array.from({ length: 2 }), []);

  return (
    <div className="App">
      <header className="header">
        <div>
          <h1>🛍️ Product Comparison</h1>
          <p>Compare products from Amazon & Flipkart</p>
        </div>
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

  <button
    type="button"
    className="copyBtn"
    onClick={copyShareLink}
    disabled={loading}
    title="Copy shareable link"
  >
    Copy link
  </button>
</div>

      {/* New: controls */}
      {!loading && productsWithKey.length > 0 && (
        <div className="controls">
          <div className="controlGroup">
            <span className="controlLabel">Filter:</span>
            <button
              className={`chip ${sourceFilter === 'All' ? 'active' : ''}`}
              onClick={() => setSourceFilter('All')}
            >
              All
            </button>
            <button
              className={`chip ${sourceFilter === 'Amazon' ? 'active' : ''}`}
              onClick={() => setSourceFilter('Amazon')}
            >
              Amazon
            </button>
            <button
              className={`chip ${sourceFilter === 'Flipkart' ? 'active' : ''}`}
              onClick={() => setSourceFilter('Flipkart')}
            >
              Flipkart
            </button>
          </div>

          <div className="controlGroup">
            <span className="controlLabel">Sort:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="select">
              <option value="best">Best (winners first)</option>
              <option value="priceAsc">Price (low → high)</option>
              <option value="priceDesc">Price (high → low)</option>
              <option value="ratingDesc">Rating (high → low)</option>
            </select>
          </div>
        </div>
      )}

      {error && (
  <div className="error-message">
    <div style={{ fontWeight: 900, marginBottom: 6 }}>{error}</div>
    <div style={{ color: 'rgba(238,243,255,.75)', fontSize: 13 }}>
      Try:{" "}
      {['laptop', 'iphone', 'headphones', 'smart watch'].map((q) => (
        <button
          key={q}
          className="chip"
          style={{ marginLeft: 8 }}
          onClick={() => {
            setSearchTerm(q);
            setTimeout(fetchProducts, 0);
          }}
        >
          {q}
        </button>
      ))}
    </div>
  </div>
)}

      {!loading && visibleProducts.length > 0 && (
        <div className="results-summary">
          <p>
            Showing <strong>{visibleProducts.length}</strong> of{' '}
            <strong>{productsWithKey.length}</strong> products
          </p>
        </div>
      )}

      <div className="products-container">
        {loading &&
          skeletons.map((_, i) => (
            <div key={i} className="product-card skeleton">
              <div className="sk-line sk-title" />
              <div className="sk-line sk-sub" />
              <div className="sk-line sk-price" />
              <div className="sk-line sk-rating" />
              <div className="sk-btn" />
            </div>
          ))}

        {!loading &&
          visibleProducts.map((product) => {
            const key = product._key;
            const isBestPrice = key === bestPriceId;
            const isBestRating = key === bestRatingId;

            return (
              <div
                key={key}
                className={[
                  'product-card',
                  isBestPrice ? 'winner winner-price' : '',
                  isBestRating ? 'winner winner-rating' : '',
                ].join(' ')}
              >
                <div className="winnerRow">
                  {isBestPrice && <span className="winnerBadge">Best Price</span>}
                  {isBestRating && <span className="winnerBadge alt">Top Rated</span>}
                </div>

                <h3>{product.name}</h3>
                <p className="source">{product.source}</p>
                <p className="price">{formatCurrency(product.price)}</p>
                <p className="rating">⭐ {toNum(product.rating, 0).toFixed(1)} / 5</p>

                <a href={product.link} target="_blank" rel="noopener noreferrer">
                  View Product →
                </a>
              </div>
            );
          })}
      </div>

      {!loading && visibleProducts.length > 0 && (
        <ComparisonTable
          products={visibleProducts}
          bestPriceId={bestPriceId}
          bestRatingId={bestRatingId}
          bestPriceValue={bestPriceValue}
          bestRatingValue={bestRatingValue}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
}

export default App;