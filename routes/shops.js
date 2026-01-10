const express = require('express');
const { 
  getShops, 
  getShop, 
  createShop, 
  updateShop, 
  deleteShop,
  getShopProfile,
  createOrUpdateShopProfile
} = require('../controllers/shopController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Profile routes MUST come before /:id routes
router.get('/profile', auth, getShopProfile);
router.post('/profile', auth, createOrUpdateShopProfile);

// Other routes
router.get('/', getShops);
router.get('/:id', getShop);
router.post('/', auth, authorize('shopkeeper', 'admin'), createShop);
router.put('/:id', auth, updateShop);
router.delete('/:id', auth, deleteShop);

module.exports = router;
