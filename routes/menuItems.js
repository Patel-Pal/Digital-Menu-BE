const express = require('express');
const { body } = require('express-validator');
const {
  getMenuItemsByShop,
  getAllMenuItemsForManagement,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemStatus
} = require('../controllers/menuItemController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/shop/:shopId', getMenuItemsByShop);

// Protected routes
router.get('/manage/:shopId', auth, getAllMenuItemsForManagement);

router.post('/', auth, [
  body('name').notEmpty().withMessage('Menu item name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('categoryId').notEmpty().withMessage('Category is required'),
  body('shopId').notEmpty().withMessage('Shop ID is required')
], createMenuItem);

router.put('/:id', auth, [
  body('name').notEmpty().withMessage('Menu item name is required'),
  body('price').isNumeric().withMessage('Price must be a number')
], updateMenuItem);

router.delete('/:id', auth, deleteMenuItem);

router.patch('/:id/toggle', auth, toggleMenuItemStatus);

module.exports = router;
