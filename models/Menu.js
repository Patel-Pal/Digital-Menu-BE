const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  icon: String,
  order: {
    type: Number,
    default: 0
  }
});

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  image: String,
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
  popular: {
    type: Boolean,
    default: false
  },
  vegetarian: {
    type: Boolean,
    default: false
  },
  spicy: {
    type: Boolean,
    default: false
  }
});

const menuSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  categories: [categorySchema],
  items: [menuItemSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Menu', menuSchema);
