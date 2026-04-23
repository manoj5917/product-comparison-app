const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
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
    max: 5,
    default: 0
  },
  description: String,
  imageUrl: String,
  category: {
    type: String,
    default: 'General'
  },
  inStock: {
    type: Boolean,
    default: true
  },
  reviews: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);