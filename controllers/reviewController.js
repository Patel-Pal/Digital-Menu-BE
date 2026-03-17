const Review = require('../models/Review');
const Shop = require('../models/Shop');

// Helper: resolve shopId (accepts ownerId or shop._id)
const resolveShopId = async (id) => {
  let shop = await Shop.findOne({ ownerId: id }).catch(() => null);
  if (!shop) shop = await Shop.findById(id).catch(() => null);
  return shop;
};

// @desc  Submit a review for a shop
// @route POST /api/reviews/:shopId
// @access Public
exports.submitReview = async (req, res) => {
  try {
    const { rating, comment, customerName, deviceId } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    if (!deviceId) {
      return res.status(400).json({ message: 'deviceId is required' });
    }

    const shop = await resolveShopId(req.params.shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    // Always create a new review (multiple reviews allowed per customer)
    const review = await Review.create({
      shopId: shop._id,
      deviceId,
      customerName: customerName || 'Anonymous',
      rating,
      comment: comment || ''
    });

    // Recalculate shop's average rating
    const stats = await Review.aggregate([
      { $match: { shopId: shop._id } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (stats.length > 0) {
      await Shop.findByIdAndUpdate(shop._id, {
        rating: Math.round(stats[0].avg * 10) / 10,
        reviewCount: stats[0].count
      });
    }

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get reviews for a shop
// @route GET /api/reviews/:shopId
// @access Public
exports.getReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const shop = await resolveShopId(req.params.shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total, stats] = await Promise.all([
      Review.find({ shopId: shop._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments({ shopId: shop._id }),
      Review.aggregate([
        { $match: { shopId: shop._id } },
        {
          $group: {
            _id: null,
            avg: { $avg: '$rating' },
            count: { $sum: 1 },
            five:  { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
            four:  { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
            three: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
            two:   { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
            one:   { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
          }
        }
      ])
    ]);

    const distribution = stats[0]
      ? {
          5: stats[0].five,
          4: stats[0].four,
          3: stats[0].three,
          2: stats[0].two,
          1: stats[0].one
        }
      : { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    res.json({
      success: true,
      data: reviews,
      averageRating: stats[0] ? Math.round(stats[0].avg * 10) / 10 : 0,
      totalReviews: total,
      distribution,
      pagination: { page: parseInt(page), limit: parseInt(limit), total }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Check if device already reviewed this shop
// @route GET /api/reviews/:shopId/check/:deviceId
// @access Public
exports.checkReview = async (req, res) => {
  try {
    const shop = await resolveShopId(req.params.shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    const review = await Review.findOne({ shopId: shop._id, deviceId: req.params.deviceId });
    res.json({ success: true, hasReviewed: !!review, data: review || null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a review (shopkeeper can delete reviews on their shop)
// @route DELETE /api/reviews/:reviewId
// @access Private (shopkeeper/admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId).populate('shopId');
    if (!review) return res.status(404).json({ message: 'Review not found' });

    const isOwner = review.shopId.ownerId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Review.findByIdAndDelete(req.params.reviewId);

    // Recalculate rating after deletion
    const stats = await Review.aggregate([
      { $match: { shopId: review.shopId._id } },
      { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    await Shop.findByIdAndUpdate(review.shopId._id, {
      rating: stats.length > 0 ? Math.round(stats[0].avg * 10) / 10 : 0,
      reviewCount: stats.length > 0 ? stats[0].count : 0
    });

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
