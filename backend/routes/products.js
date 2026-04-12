const express = require('express');
const router = express.Router();

const mockProducts = [
  { id: 1, name: 'Laptop', price: 50000, source: 'Amazon', link: 'https://amazon.com/laptop1', rating: 4.5 },
  { id: 2, name: 'Laptop', price: 48000, source: 'Flipkart', link: 'https://flipkart.com/laptop1', rating: 4.3 },
  { id: 3, name: 'Phone', price: 20000, source: 'Amazon', link: 'https://amazon.com/phone1', rating: 4.2 },
  { id: 4, name: 'Phone', price: 19000, source: 'Flipkart', link: 'https://flipkart.com/phone1', rating: 4.4 },
  { id: 5, name: 'Tablet', price: 30000, source: 'Amazon', link: 'https://amazon.com/tablet1', rating: 4.1 },
  { id: 6, name: 'Tablet', price: 28000, source: 'Flipkart', link: 'https://flipkart.com/tablet1', rating: 4.2 }
];

router.get('/', (req, res) => {
  const { search } = req.query;
  const filtered = mockProducts.filter(p => 
    p.name.toLowerCase().includes((search || '').toLowerCase())
  );
  res.json(filtered);
});

router.get('/:id', (req, res) => {
  const product = mockProducts.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

module.exports = router;