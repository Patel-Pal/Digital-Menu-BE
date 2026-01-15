const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

// Public routes (for customers)
router.post('/', orderController.createOrder);
router.get('/customer/:deviceId', orderController.getCustomerOrders);

// Protected routes (for shop owners)
router.get('/shop/:shopId', auth, orderController.getShopOrders);
router.put('/:orderId/status', auth, orderController.updateOrderStatus);

// Single order route (should be last to avoid conflicts)
router.get('/:orderId', orderController.getOrder);

module.exports = router;
