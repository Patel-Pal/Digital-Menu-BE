const express = require('express');
const { getMenuByShop, createOrUpdateMenu, addMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/shop/:shopId', getMenuByShop);
router.post('/', auth, authorize('shopkeeper', 'admin'), createOrUpdateMenu);
router.post('/:menuId/items', auth, authorize('shopkeeper', 'admin'), addMenuItem);
router.put('/:menuId/items/:itemId', auth, authorize('shopkeeper', 'admin'), updateMenuItem);
router.delete('/:menuId/items/:itemId', auth, authorize('shopkeeper', 'admin'), deleteMenuItem);

module.exports = router;
