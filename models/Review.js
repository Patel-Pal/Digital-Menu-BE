const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
    index: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
    default: 'Anonymous'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    default: ''
  },
  deviceId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

reviewSchema.index({ shopId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
