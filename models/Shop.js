const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  logo: String,
  banner: String,
  address: String,
  phone: String,
  email: String,
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subscription: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  qrScans: {
    type: Number,
    default: 0
  },
  menuViews: {
    type: Number,
    default: 0
  },
  menuTheme: {
    type: String,
    enum: ['coral', 'ocean', 'forest', 'sunset', 'midnight', 'lavender'],
    default: 'coral'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Shop', shopSchema);
