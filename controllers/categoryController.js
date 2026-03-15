const Category = require('../models/Category');

// @desc    Get all categories for a shop
// @route   GET /api/categories/shop/:shopId
// @access  Public
const getCategoriesByShop = async (req, res) => {
  try {
    let shopId = req.params.shopId;
    
    let categories = await Category.find({ 
      shopId: shopId,
      isActive: true 
    }).sort({ order: 1 });
    
    // If no categories found, shopId might be the Shop _id while
    // categories are stored with ownerId. Look up shop and try ownerId.
    if (categories.length === 0) {
      const Shop = require('../models/Shop');
      const shop = await Shop.findById(shopId).catch(() => null);
      if (shop && shop.ownerId) {
        categories = await Category.find({ 
          shopId: shop.ownerId,
          isActive: true 
        }).sort({ order: 1 });
      }
    }
    
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all categories (including inactive) for shop owner
// @route   GET /api/categories/manage/:shopId
// @access  Private (Shopkeeper/Admin)
const getAllCategoriesForManagement = async (req, res) => {
  try {
    const categories = await Category.find({ 
      shopId: req.params.shopId 
    }).sort({ order: 1 });
    
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private (Shopkeeper/Admin)
const createCategory = async (req, res) => {
  try {
    const { name, description, icon, order, shopId } = req.body;
    
    const category = await Category.create({
      name,
      description,
      icon,
      order,
      shopId,
      isActive: true
    });
    
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Shopkeeper/Admin)
const updateCategory = async (req, res) => {
  try {
    const { name, description, icon, order, isActive } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, icon, order, isActive },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Shopkeeper/Admin)
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle category status
// @route   PATCH /api/categories/:id/toggle
// @access  Private (Shopkeeper/Admin)
const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    category.isActive = !category.isActive;
    await category.save();
    
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCategoriesByShop,
  getAllCategoriesForManagement,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus
};
