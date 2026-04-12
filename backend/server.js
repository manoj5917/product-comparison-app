const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/external-products', require('./routes/external-products'));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Product Comparison API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});