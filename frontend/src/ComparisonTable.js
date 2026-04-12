import React from 'react';
import './ComparisonTable.css';

function ComparisonTable({ products }) {
  if (products.length === 0) {
    return <p className="no-products">No products to compare. Search for products first!</p>;
  }

  // Group products by name for comparison
  const groupedProducts = {};
  products.forEach(product => {
    if (!groupedProducts[product.name]) {
      groupedProducts[product.name] = [];
    }
    groupedProducts[product.name].push(product);
  });

  return (
    <div className="comparison-container">
      {Object.entries(groupedProducts).map(([productName, items]) => (
        <div key={productName} className="comparison-section">
          <h2>{productName} - Comparison</h2>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Property</th>
                {items.map((item) => (
                  <th key={item.id}>{item.source}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Price</strong></td>
                {items.map((item) => (
                  <td key={item.id} className="price">${item.price}</td>
                ))}
              </tr>
              <tr>
                <td><strong>Rating</strong></td>
                {items.map((item) => (
                  <td key={item.id} className="rating">⭐ {item.rating}/5</td>
                ))}
              </tr>
              <tr>
                <td><strong>Link</strong></td>
                {items.map((item) => (
                  <td key={item.id}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      View →
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default ComparisonTable;