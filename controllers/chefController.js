const User = require('../models/User');
const Shop = require('../models/Shop');

// Helper: find shop by _id or by ownerId (shopkeepers pass their user._id as shopId)
const findShop = async (shopId) => {
  let shop = await Shop.findById(shopId).catch(() => null);
  if (!shop) {
    shop = await Shop.findOne({ ownerId: shopId });
  }
  return shop;
};

// @desc    Create chef account
// @route   POST /api/shops/:shopId/chefs
// @access  Private (Shopkeeper who owns the shop)
const createChef = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { name, email, password } = req.body;

    const shop = await findShop(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    if (shop.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Use the actual shop._id for the chef's shopId
    const chef = await User.create({
      name,
      email,
      password,
      role: 'chef',
      shopId: shop._id
    });

    res.status(201).json({
      success: true,
      data: {
        id: chef._id,
        name: chef.name,
        email: chef.email,
        role: chef.role,
        shopId: chef.shopId,
        isActive: chef.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get all chefs for a shop
// @route   GET /api/shops/:shopId/chefs
// @access  Private (Shopkeeper who owns the shop)
const getShopChefs = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await findShop(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    if (shop.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const chefs = await User.find({ role: 'chef', shopId: shop._id })
      .select('name email isActive createdAt');

    res.json({
      success: true,
      data: chefs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update chef details
// @route   PUT /api/shops/:shopId/chefs/:chefId
// @access  Private (Shopkeeper who owns the shop)
const updateChef = async (req, res) => {
  try {
    const { shopId, chefId } = req.params;
    const { name, email, isActive } = req.body;

    const shop = await findShop(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    if (shop.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const chef = await User.findById(chefId);
    if (!chef || chef.role !== 'chef' || chef.shopId.toString() !== shop._id.toString()) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    if (email && email.toLowerCase() !== chef.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    if (name !== undefined) chef.name = name;
    if (email !== undefined) chef.email = email;
    if (isActive !== undefined) chef.isActive = isActive;

    await chef.save();

    res.json({
      success: true,
      data: {
        id: chef._id,
        name: chef.name,
        email: chef.email,
        isActive: chef.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete chef account
// @route   DELETE /api/shops/:shopId/chefs/:chefId
// @access  Private (Shopkeeper who owns the shop)
const deleteChef = async (req, res) => {
  try {
    const { shopId, chefId } = req.params;

    const shop = await findShop(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    if (shop.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const chef = await User.findById(chefId);
    if (!chef || chef.role !== 'chef' || chef.shopId.toString() !== shop._id.toString()) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    await User.findByIdAndDelete(chefId);

    res.json({ success: true, message: 'Chef deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createChef, getShopChefs, updateChef, deleteChef };
