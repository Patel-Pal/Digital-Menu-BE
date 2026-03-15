const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, authorize, optionalAuth } = require('../middleware/auth');

// Public routes (for customers), with optional auth for waiters
router.post('/', optionalAuth, orderController.createOrder);
router.get('/customer/:deviceId', orderController.getCustomerOrders);

// Protected routes (for shop owners and waiters)
router.get('/shop/:shopId', auth, authorize('shopkeeper', 'waiter'), orderController.getShopOrders);
router.put('/:orderId/status', auth, authorize('shopkeeper', 'waiter'), orderController.updateOrderStatus);

// Single order route (should be last to avoid conflicts)
router.get('/:orderId', orderController.getOrder);

module.exports = router;
