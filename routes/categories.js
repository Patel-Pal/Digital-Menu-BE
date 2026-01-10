const express = require('express');
const { body } = require('express-validator');
const {
  getCategoriesByShop,
  getAllCategoriesForManagement,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus
} = require('../controllers/categoryController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/shop/:shopId', getCategoriesByShop);

// Protected routes
router.get('/manage/:shopId', auth, getAllCategoriesForManagement);

router.post('/', auth, [
  body('name').notEmpty().withMessage('Category name is required'),
  body('shopId').notEmpty().withMessage('Shop ID is required')
], createCategory);

router.put('/:id', auth, [
  body('name').notEmpty().withMessage('Category name is required')
], updateCategory);

router.delete('/:id', auth, deleteCategory);

router.patch('/:id/toggle', auth, toggleCategoryStatus);

module.exports = router;
