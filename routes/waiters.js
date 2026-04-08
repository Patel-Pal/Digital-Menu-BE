const express = require('express');
const router = express.Router();
const { createWaiter, getShopWaiters, updateWaiter, deleteWaiter } = require('../controllers/waiterController');
const { auth, authorize } = require('../middleware/auth');
const { requireFeature } = require('../middleware/featureGate');

// All routes require auth + shopkeeper authorization
router.post('/shops/:shopId/waiters', auth, authorize('shopkeeper'), requireFeature('waiters'), createWaiter);
router.get('/shops/:shopId/waiters', auth, authorize('shopkeeper'), requireFeature('waiters'), getShopWaiters);
router.put('/shops/:shopId/waiters/:waiterId', auth, authorize('shopkeeper'), requireFeature('waiters'), updateWaiter);
router.delete('/shops/:shopId/waiters/:waiterId', auth, authorize('shopkeeper'), requireFeature('waiters'), deleteWaiter);

module.exports = router;
