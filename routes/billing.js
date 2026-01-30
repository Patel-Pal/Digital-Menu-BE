const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { auth } = require('../middleware/auth');

// Public routes (for customers)
router.post('/generate', billingController.generateBill);
router.get('/customer/:deviceId', billingController.getCustomerBills);
router.get('/:billId', billingController.getBill);

// Protected routes (for shop owners)
router.get('/shop/:shopId', auth, billingController.getShopBills);
router.put('/:billId/payment', billingController.updatePaymentStatus);

// Debug route
router.get('/debug/orders', billingController.debugOrders);

module.exports = router;
