const express = require('express');
const { 
  getShops, 
  getShop, 
  createShop, 
  updateShop, 
  deleteShop,
  getShopProfile,
  createOrUpdateShopProfile,
  getShopAnalytics,
  incrementScan,
  incrementView,
  getDetailedAnalytics,
  getMyFeatures
} = require('../controllers/shopController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Profile routes MUST come before /:id routes
router.get('/profile', auth, getShopProfile);
router.post('/profile', auth, createOrUpdateShopProfile);
router.get('/analytics', auth, getShopAnalytics);
router.get('/analytics/detailed', auth, getDetailedAnalytics);
router.get('/my/features', auth, authorize('shopkeeper'), getMyFeatures);

// Other routes
router.get('/', getShops);
router.get('/:id', getShop);
router.post('/', auth, authorize('shopkeeper', 'admin'), createShop);
router.put('/:id', auth, updateShop);
router.delete('/:id', auth, deleteShop);
router.post('/:id/scan', incrementScan);
router.post('/:id/view', incrementView);

module.exports = router;
