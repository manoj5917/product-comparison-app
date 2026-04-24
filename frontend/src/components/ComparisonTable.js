import React from 'react';
import './ComparisonTable.css';

function ComparisonTable({ products }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="comparison-table">
      <h2>Price Comparison</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Source</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td><span className="source-badge">{product.source}</span></td>
              <td className="price">₹{product.price}</td>
              <td>⭐ {product.rating}</td>
              <td>
                <a href={product.link} target="_blank" rel="noopener noreferrer" className="view-link">
                  View →
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ComparisonTable;