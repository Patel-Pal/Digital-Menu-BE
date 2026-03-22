const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');
const { auth, authorize } = require('../middleware/auth');

// Protected routes (shopkeeper only)
router.get('/config/:shopId', auth, discountController.getDiscountConfig);
router.put('/config/:shopId', auth, authorize('shopkeeper'), discountController.updateDiscountConfig);

// Public routes (no auth)
router.get('/active/:shopId', discountController.getActiveDiscounts);
router.post('/spin/:shopId', discountController.spinWheel);
router.post('/scratch/:shopId', discountController.scratchCard);
router.post('/coupon/validate', discountController.validateCoupon);
router.get('/rewards/:shopId/:deviceId', discountController.getCustomerRewards);
router.get('/loyalty/:shopId/:deviceId', discountController.getLoyaltyProgress);

module.exports = router;
