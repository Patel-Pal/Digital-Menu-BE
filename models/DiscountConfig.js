const mongoose = require('mongoose');

const spinWheelSegmentSchema = new mongoose.Schema({
  label: { type: String, required: true },
  rewardType: { type: String, enum: ['percentage', 'flat', 'freeItem'], required: true },
  rewardValue: { type: Number, required: true },
  probability: { type: Number, required: true }
}, { _id: true });

const scratchCardRewardSchema = new mongoose.Schema({
  label: { type: String, required: true },
  rewardType: { type: String, enum: ['percentage', 'flat'], required: true },
  rewardValue: { type: Number, required: true },
  probability: { type: Number, required: true }
}, { _id: true });

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true },
  discountType: { type: String, enum: ['percentage', 'flat'], required: true },
  discountValue: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  maxUsage: { type: Number, required: true },
  currentUsage: { type: Number, default: 0 },
  minOrderAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { _id: true });

const discountConfigSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
    unique: true
  },
  spinWheel: {
    enabled: { type: Boolean, default: false },
    segments: [spinWheelSegmentSchema]
  },
  scratchCard: {
    enabled: { type: Boolean, default: false },
    rewards: [scratchCardRewardSchema]
  },
  couponCode: {
    enabled: { type: Boolean, default: false },
    coupons: [couponSchema]
  },
  loyaltyCard: {
    enabled: { type: Boolean, default: false },
    stampsRequired: { type: Number, default: 5, min: 3, max: 20 },
    rewardType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' },
    rewardValue: { type: Number, default: 10 }
  },
  happyHour: {
    enabled: { type: Boolean, default: false },
    startTime: { type: String },
    endTime: { type: String },
    discountPercentage: { type: Number, min: 1, max: 50 },
    applicableDays: [{ type: Number, min: 0, max: 6 }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DiscountConfig', discountConfigSchema);
