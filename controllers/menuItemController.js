const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

// @desc    Get all menu items for a shop
// @route   GET /api/menu-items/shop/:shopId
// @access  Public
const getMenuItemsByShop = async (req, res) => {
  try {
    let shopId = req.params.shopId;
    
    // Try fetching with the given shopId first
    let menuItems = await MenuItem.find({ 
      shopId: shopId,
      isActive: true 
    }).populate('categoryId', 'name icon');
    
    // If no items found, the shopId might be the Shop document _id
    // while items are stored with ownerId. Look up the shop and try ownerId.
    if (menuItems.length === 0) {
      const Shop = require('../models/Shop');
      const shop = await Shop.findById(shopId).catch(() => null);
      if (shop && shop.ownerId) {
        menuItems = await MenuItem.find({ 
          shopId: shop.ownerId,
          isActive: true 
        }).populate('categoryId', 'name icon');
      }
    }
    
    res.json({ success: true, data: menuItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all menu items (including inactive) for management
// @route   GET /api/menu-items/manage/:shopId
// @access  Private (Shopkeeper/Admin)
const getAllMenuItemsForManagement = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ 
      shopId: req.params.shopId 
    }).populate('categoryId', 'name icon');
    
    res.json({ success: true, data: menuItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create menu item
// @route   POST /api/menu-items
// @access  Private (Shopkeeper/Admin)
const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, image, categoryId, ingredients, available, popular, vegetarian, spicy, shopId } = req.body;
    
    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      image,
      categoryId,
      ingredients: ingredients || [],
      available,
      popular,
      vegetarian,
      spicy,
      shopId,
      isActive: true
    });
    
    const populatedItem = await MenuItem.findById(menuItem._id).populate('categoryId', 'name icon');
    
    res.status(201).json({ success: true, data: populatedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu-items/:id
// @access  Private (Shopkeeper/Admin)
const updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, image, categoryId, ingredients, available, popular, vegetarian, spicy, isActive } = req.body;
    
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image, categoryId, ingredients, available, popular, vegetarian, spicy, isActive },
      { new: true, runValidators: true }
    ).populate('categoryId', 'name icon');
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json({ success: true, data: menuItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu-items/:id
// @access  Private (Shopkeeper/Admin)
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle menu item status
// @route   PATCH /api/menu-items/:id/toggle
// @access  Private (Shopkeeper/Admin)
const toggleMenuItemStatus = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    menuItem.isActive = !menuItem.isActive;
    await menuItem.save();
    
    const populatedItem = await MenuItem.findById(menuItem._id).populate('categoryId', 'name icon');
    
    res.json({ success: true, data: populatedItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMenuItemsByShop,
  getAllMenuItemsForManagement,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemStatus
};
