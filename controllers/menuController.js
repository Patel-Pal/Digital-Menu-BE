const Menu = require('../models/Menu');

// @desc    Get menu by shop ID
// @route   GET /api/menus/shop/:shopId
// @access  Public
const getMenuByShop = async (req, res) => {
  try {
    const menu = await Menu.findOne({ shopId: req.params.shopId });
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    res.json({ success: true, data: menu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create/Update menu
// @route   POST /api/menus
// @access  Private (Shopkeeper)
const createOrUpdateMenu = async (req, res) => {
  try {
    const { shopId } = req.body;
    
    let menu = await Menu.findOne({ shopId });
    if (menu) {
      menu = await Menu.findOneAndUpdate({ shopId }, req.body, { new: true });
    } else {
      menu = await Menu.create(req.body);
    }
    
    res.json({ success: true, data: menu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add menu item
// @route   POST /api/menus/:menuId/items
// @access  Private (Shopkeeper)
const addMenuItem = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.menuId);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    menu.items.push(req.body);
    await menu.save();
    
    res.status(201).json({ success: true, data: menu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menus/:menuId/items/:itemId
// @access  Private (Shopkeeper)
const updateMenuItem = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.menuId);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    const item = menu.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    Object.assign(item, req.body);
    await menu.save();
    
    res.json({ success: true, data: menu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menus/:menuId/items/:itemId
// @access  Private (Shopkeeper)
const deleteMenuItem = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.menuId);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    menu.items.id(req.params.itemId).remove();
    await menu.save();
    
    res.json({ success: true, data: menu });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMenuByShop, createOrUpdateMenu, addMenuItem, updateMenuItem, deleteMenuItem };
