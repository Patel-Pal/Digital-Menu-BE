const express = require('express');
const router = express.Router();
const { createWaiter, getShopWaiters, updateWaiter, deleteWaiter } = require('../controllers/waiterController');
const { auth, authorize } = require('../middleware/auth');

// All routes require auth + shopkeeper authorization
router.post('/shops/:shopId/waiters', auth, authorize('shopkeeper'), createWaiter);
router.get('/shops/:shopId/waiters', auth, authorize('shopkeeper'), getShopWaiters);
router.put('/shops/:shopId/waiters/:waiterId', auth, authorize('shopkeeper'), updateWaiter);
router.delete('/shops/:shopId/waiters/:waiterId', auth, authorize('shopkeeper'), deleteWaiter);

module.exports = router;
