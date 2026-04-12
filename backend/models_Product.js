const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  source: {
    type: String,
    enum: ['Amazon', 'Flipkart'],
    required: true
  },
  link: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  description: String,
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);