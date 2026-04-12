const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/product-comparison';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
//app.use('/api/products', require('./routes/products'));
app.use('/api/external-products', require('./routes/external-products'));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Product Comparison API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});