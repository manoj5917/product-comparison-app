import React from 'react';
import './ComparisonTable.css';

const toNum = (v, fallback = NaN) => {
  const n = Number(v);
  return Number.isNaN(n) ? fallback : n;
};

function ComparisonTable({
  products,
  bestPriceId,
  bestRatingId,
  bestPriceValue,
  bestRatingValue,
  formatCurrency,
}) {
  if (!products || products.length === 0) return null;

  const bestPriceProduct = products.find(
    (p) => (p._key ?? p.id ?? `${p.name}-${p.source}-${p.link}`) === bestPriceId
  );
  const bestRatingProduct = products.find(
    (p) => (p._key ?? p.id ?? `${p.name}-${p.source}-${p.link}`) === bestRatingId
  );

  const priceDeltaText = (price) => {
    if (bestPriceValue == null) return '—';
    const p = toNum(price, NaN);
    if (Number.isNaN(p)) return '—';
    const diff = p - bestPriceValue;
    if (diff === 0) return 'Best';
    const abs = Math.abs(diff);
    return diff > 0 ? `+${formatCurrency(abs)}` : `-${formatCurrency(abs)}`;
  };

  const ratingDeltaText = (rating) => {
    if (bestRatingValue == null) return '—';
    const r = toNum(rating, NaN);
    if (Number.isNaN(r)) return '—';
    const diff = r - bestRatingValue;
    if (diff === 0) return 'Top';
    const sign = diff > 0 ? '+' : '';
    return `${sign}${diff.toFixed(1)}`;
  };

  // Summary
  const summary = (() => {
    const parts = [];

    if (bestPriceProduct && bestPriceValue != null) {
      const cheapestSource = bestPriceProduct.source;
      parts.push(
        `${cheapestSource} has the best price (${formatCurrency(bestPriceValue)})`
      );
    }

    if (bestRatingProduct && bestRatingValue != null) {
      const topSource = bestRatingProduct.source;
      parts.push(`${topSource} is top rated (${bestRatingValue.toFixed(1)} / 5)`);
    }

    // If we have at least 2 products, show the cheapest-vs-second-cheapest gap
    if (bestPriceValue != null && products.length >= 2) {
      const sortedByPrice = [...products]
        .map((p) => ({ p, price: toNum(p.price, Infinity) }))
        .sort((a, b) => a.price - b.price);

      const second = sortedByPrice[1];
      if (second && Number.isFinite(second.price)) {
        const diff = second.price - bestPriceValue;
        if (diff > 0) parts.push(`${formatCurrency(diff)} cheaper than the next option`);
      }
    }

    return parts.join(' • ');
  })();

  return (
    <div className="comparison-table">
      <h2>Price Comparison</h2>

      {summary && <div className="compare-summary">{summary}</div>}

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Source</th>
            <th>Price</th>
            <th>Δ vs Best</th>
            <th>Rating</th>
            <th>Δ vs Top</th>
            <th>Link</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            const key = product._key ?? product.id ?? `${product.name}-${product.source}-${product.link}`;
            const isBestPrice = key === bestPriceId;
            const isBestRating = key === bestRatingId;

            return (
              <tr
                key={key}
                className={[
                  isBestPrice ? 'rowWinnerPrice' : '',
                  isBestRating ? 'rowWinnerRating' : '',
                ].join(' ')}
              >
                <td>
                  {product.name}{' '}
                  <span className="inlineBadges">
                    {isBestPrice && <span className="miniBadge">Best Price</span>}
                    {isBestRating && <span className="miniBadge alt">Top Rated</span>}
                  </span>
                </td>
                <td>
                  <span className="source-badge">{product.source}</span>
                </td>
                <td className="price">{formatCurrency ? formatCurrency(product.price) : product.price}</td>
                <td className={isBestPrice ? 'delta good' : 'delta'}>{priceDeltaText(product.price)}</td>
                <td>⭐ {toNum(product.rating, 0).toFixed(1)} / 5</td>
                <td className={isBestRating ? 'delta good' : 'delta'}>{ratingDeltaText(product.rating)}</td>
                <td>
                  <a href={product.link} target="_blank" rel="noopener noreferrer" className="view-link">
                    View →
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ComparisonTable;