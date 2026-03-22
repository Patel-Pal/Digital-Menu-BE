const mongoose = require('mongoose');

const discountRewardSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  deviceId: { type: String, required: true },
  type: {
    type: String,
    enum: ['spin_win', 'scratch_card', 'loyalty', 'loyalty_progress'],
    required: true
  },
  label: { type: String },
  rewardType: { type: String, enum: ['percentage', 'flat', 'freeItem'] },
  rewardValue: { type: Number },
  status: {
    type: String,
    enum: ['available', 'redeemed', 'expired'],
    default: 'available'
  },
  redeemedAt: { type: Date },
  billId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill' },
  expiresAt: { type: Date },
  currentStamps: { type: Number, default: 0 },
  stampsRequired: { type: Number }
}, {
  timestamps: true
});

// Compound index for efficient queries by shopId + deviceId + type
discountRewardSchema.index({ shopId: 1, deviceId: 1, type: 1 });

// TTL index to auto-expire documents when expiresAt is reached
discountRewardSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('DiscountReward', discountRewardSchema);
