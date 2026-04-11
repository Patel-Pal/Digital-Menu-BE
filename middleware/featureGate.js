const Shop = require('../models/Shop');
const { resolveFeatures } = require('../config/featureMatrix');

/**
 * Middleware factory that gates access to a feature based on the shop's
 * subscription plan and per-shop feature overrides.
 *
 * Usage: router.get('/route', auth, requireFeature('billing'), controller)
 */
function requireFeature(featureKey) {
  return async (req, res, next) => {
    try {
      // If no user or no role, let downstream auth middleware handle it
      if (!req.user || !req.user.role) {
        return next();
      }

      // Admin and customer roles are never feature-gated
      if (req.user.role === 'admin' || req.user.role === 'customer') {
        return next();
      }

      // For shopkeeper, waiter, chef — enforce the gate
      if (['shopkeeper', 'waiter', 'chef'].includes(req.user.role)) {
        // Try shopId first, then fall back to ownerId lookup
        let shop = req.user.shopId
          ? await Shop.findById(req.user.shopId).select('subscription featureOverrides')
          : null;
        if (!shop) {
          shop = await Shop.findOne({ ownerId: req.user._id }).select('subscription featureOverrides');
        }

        // Shop not found — let downstream handle it
        if (!shop) {
          return next();
        }

        const resolved = resolveFeatures(shop.subscription, shop.featureOverrides);

        if (!resolved.includes(featureKey)) {
          return res.status(403).json({
            success: false,
            message: 'This feature is not available on your current plan. Please upgrade to access this feature.',
          });
        }
      }

      next();
    } catch (error) {
      console.error('Feature gate middleware error:', error);
      next(error);
    }
  };
}

module.exports = { requireFeature };
