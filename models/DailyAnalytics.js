const mongoose = require('mongoose');

const dailyAnalyticsSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true
  },
  scans: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  uniqueVisitors: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
dailyAnalyticsSchema.index({ shopId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyAnalytics', dailyAnalyticsSchema);
