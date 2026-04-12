const express = require('express');
const axios = require('axios');
const router = express.Router();

// Mock function - Replace with real API calls
async function searchAmazon(query) {
  // In production, use Amazon Product Advertising API
  // For now, return mock data
  return [
    {
      id: `amazon-${Date.now()}`,
      name: query,
      price: Math.floor(Math.random() * 100000) + 5000,
      source: 'Amazon',
      link: `https://www.amazon.in/s?k=${query}`,
      rating: (Math.random() * 2 + 3).toFixed(1)
    }
  ];
}

async function searchFlipkart(query) {
  // In production, use Flipkart API
  // For now, return mock data
  return [
    {
      id: `flipkart-${Date.now()}`,
      name: query,
      price: Math.floor(Math.random() * 100000) + 5000,
      source: 'Flipkart',
      link: `https://www.flipkart.com/search?q=${query}`,
      rating: (Math.random() * 2 + 3).toFixed(1)
    }
  ];
}

router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter required' });

    const [amazonProducts, flipkartProducts] = await Promise.all([
      searchAmazon(q),
      searchFlipkart(q)
    ]);

    res.json([...amazonProducts, ...flipkartProducts]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;