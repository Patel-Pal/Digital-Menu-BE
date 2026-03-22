const DiscountConfig = require('../models/DiscountConfig');
const DiscountReward = require('../models/DiscountReward');
const weightedRandom = require('../utils/weightedRandom');

// GET /api/discounts/config/:shopId
exports.getDiscountConfig = async (req, res) => {
  try {
    const { shopId } = req.params;

    let config = await DiscountConfig.findOne({ shopId });

    if (!config) {
      config = await DiscountConfig.create({ shopId });
    }

    res.json({ success: true, data: config });
  } catch (error) {
    console.error('Get discount config error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// PUT /api/discounts/config/:shopId
exports.updateDiscountConfig = async (req, res) => {
  try {
    const { shopId } = req.params;
    const updates = req.body;

    // Validate spin wheel segment count
    if (updates.spinWheel && updates.spinWheel.segments) {
      const count = updates.spinWheel.segments.length;
      if (count < 2 || count > 8) {
        return res.status(400).json({
          success: false,
          message: 'Spin wheel requires 2-8 segments'
        });
      }
    }

    // Validate scratch card reward count
    if (updates.scratchCard && updates.scratchCard.rewards) {
      const count = updates.scratchCard.rewards.length;
      if (count < 2 || count > 6) {
        return res.status(400).json({
          success: false,
          message: 'Scratch card requires 2-6 rewards'
        });
      }
    }

    // Validate happy hour start < end
    if (updates.happyHour && updates.happyHour.startTime && updates.happyHour.endTime) {
      if (updates.happyHour.startTime >= updates.happyHour.endTime) {
        return res.status(400).json({
          success: false,
          message: 'Start time must be before end time'
        });
      }
    }

    let config = await DiscountConfig.findOneAndUpdate(
      { shopId },
      { $set: updates },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({ success: true, data: config });
  } catch (error) {
    console.error('Update discount config error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/discounts/active/:shopId
exports.getActiveDiscounts = async (req, res) => {
  try {
    const { shopId } = req.params;

    const config = await DiscountConfig.findOne({ shopId });

    if (!config) {
      return res.json({ success: true, data: {} });
    }

    const active = {};

    if (config.spinWheel && config.spinWheel.enabled) {
      active.spinWheel = {
        enabled: true,
        segments: config.spinWheel.segments.map(s => ({
          label: s.label,
          rewardType: s.rewardType,
          rewardValue: s.rewardValue
        }))
      };
    }

    if (config.scratchCard && config.scratchCard.enabled) {
      active.scratchCard = {
        enabled: true,
        rewards: config.scratchCard.rewards.map(r => ({
          label: r.label,
          rewardType: r.rewardType,
          rewardValue: r.rewardValue
        }))
      };
    }

    if (config.couponCode && config.couponCode.enabled) {
      active.couponCode = { enabled: true };
    }

    if (config.loyaltyCard && config.loyaltyCard.enabled) {
      active.loyaltyCard = {
        enabled: true,
        stampsRequired: config.loyaltyCard.stampsRequired,
        rewardType: config.loyaltyCard.rewardType,
        rewardValue: config.loyaltyCard.rewardValue
      };
    }

    if (config.happyHour && config.happyHour.enabled) {
      active.happyHour = {
        enabled: true,
        startTime: config.happyHour.startTime,
        endTime: config.happyHour.endTime,
        discountPercentage: config.happyHour.discountPercentage,
        applicableDays: config.happyHour.applicableDays
      };
    }

    res.json({ success: true, data: active });
  } catch (error) {
    console.error('Get active discounts error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// POST /api/discounts/spin/:shopId
exports.spinWheel = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ success: false, message: 'deviceId is required' });
    }

    const config = await DiscountConfig.findOne({ shopId });

    if (!config || !config.spinWheel || !config.spinWheel.enabled) {
      return res.status(400).json({ success: false, message: 'This discount type is not active' });
    }

    if (!config.spinWheel.segments || config.spinWheel.segments.length === 0) {
      return res.status(400).json({ success: false, message: 'No segments configured' });
    }

    const result = weightedRandom(config.spinWheel.segments);

    // Only create a reward record if the result has actual value
    let rewardId = null;
    if (result.rewardValue > 0) {
      const reward = await DiscountReward.create({
        shopId,
        deviceId,
        type: 'spin_win',
        label: result.label,
        rewardType: result.rewardType,
        rewardValue: result.rewardValue,
        status: 'available'
      });
      rewardId = reward._id;
    }

    res.json({
      success: true,
      data: {
        rewardId,
        label: result.label,
        rewardType: result.rewardType,
        rewardValue: result.rewardValue
      }
    });
  } catch (error) {
    console.error('Spin wheel error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// POST /api/discounts/scratch/:shopId
exports.scratchCard = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({ success: false, message: 'deviceId is required' });
    }

    const config = await DiscountConfig.findOne({ shopId });

    if (!config || !config.scratchCard || !config.scratchCard.enabled) {
      return res.status(400).json({ success: false, message: 'This discount type is not active' });
    }

    if (!config.scratchCard.rewards || config.scratchCard.rewards.length === 0) {
      return res.status(400).json({ success: false, message: 'No rewards configured' });
    }

    const result = weightedRandom(config.scratchCard.rewards);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const reward = await DiscountReward.create({
      shopId,
      deviceId,
      type: 'scratch_card',
      label: result.label,
      rewardType: result.rewardType,
      rewardValue: result.rewardValue,
      status: 'available',
      expiresAt
    });

    res.json({
      success: true,
      data: {
        rewardId: reward._id,
        label: result.label,
        rewardType: result.rewardType,
        rewardValue: result.rewardValue,
        expiresAt: reward.expiresAt
      }
    });
  } catch (error) {
    console.error('Scratch card error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// POST /api/discounts/coupon/validate
exports.validateCoupon = async (req, res) => {
  try {
    const { shopId, code, orderAmount } = req.body;

    if (!shopId || !code) {
      return res.status(400).json({ success: false, message: 'shopId and code are required' });
    }

    const config = await DiscountConfig.findOne({ shopId });

    if (!config || !config.couponCode || !config.couponCode.enabled) {
      return res.status(400).json({ success: false, message: 'Coupon codes are not active for this shop' });
    }

    const coupon = config.couponCode.coupons.find(
      c => c.code.toLowerCase() === code.toLowerCase()
    );

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon code not found' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: 'Coupon is not active' });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }

    if (coupon.currentUsage >= coupon.maxUsage) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }

    if (orderAmount !== undefined && orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount not met: ₹${coupon.minOrderAmount} required`
      });
    }

    // Calculate discount
    let discountAmount;
    if (coupon.discountType === 'percentage') {
      discountAmount = (orderAmount || 0) * coupon.discountValue / 100;
    } else {
      discountAmount = Math.min(coupon.discountValue, orderAmount || 0);
    }

    res.json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        message: 'Coupon applied successfully'
      }
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/discounts/rewards/:shopId/:deviceId
exports.getCustomerRewards = async (req, res) => {
  try {
    const { shopId, deviceId } = req.params;

    const rewards = await DiscountReward.find({
      shopId,
      deviceId
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: rewards });
  } catch (error) {
    console.error('Get customer rewards error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// GET /api/discounts/loyalty/:shopId/:deviceId
exports.getLoyaltyProgress = async (req, res) => {
  try {
    const { shopId, deviceId } = req.params;

    const progress = await DiscountReward.findOne({
      shopId,
      deviceId,
      type: 'loyalty_progress'
    });

    if (!progress) {
      return res.json({
        success: true,
        data: { currentStamps: 0 }
      });
    }

    res.json({ success: true, data: progress });
  } catch (error) {
    console.error('Get loyalty progress error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
