const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { auth, optionalAuth } = require('../middleware/auth');
const { requireFeature } = require('../middleware/featureGate');

// Public routes (for customers), with optional auth for waiters
router.post('/generate', optionalAuth, billingController.generateBill);
router.get('/customer/:deviceId', billingController.getCustomerBills);
router.get('/:billId', billingController.getBill);

// Protected routes (for shop owners)
router.get('/shop/:shopId', auth, requireFeature('billing'), billingController.getShopBills);
router.get('/analytics/:shopId', auth, requireFeature('billing'), billingController.getBillingAnalytics);
router.put('/:billId/payment', billingController.updatePaymentStatus);

module.exports = router;
