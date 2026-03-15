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

// @desc    Create waiter account
// @route   POST /api/shops/:shopId/waiters
// @access  Private (Shopkeeper who owns the shop)
const createWaiter = async (req, res) => {
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

    // Use the actual shop._id for the waiter's shopId
    const waiter = await User.create({
      name,
      email,
      password,
      role: 'waiter',
      shopId: shop._id
    });

    res.status(201).json({
      success: true,
      data: {
        id: waiter._id,
        name: waiter.name,
        email: waiter.email,
        role: waiter.role,
        shopId: waiter.shopId,
        isActive: waiter.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get all waiters for a shop
// @route   GET /api/shops/:shopId/waiters
// @access  Private (Shopkeeper who owns the shop)
const getShopWaiters = async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await findShop(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    if (shop.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const waiters = await User.find({ role: 'waiter', shopId: shop._id })
      .select('name email isActive createdAt');

    res.json({
      success: true,
      data: waiters
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update waiter details
// @route   PUT /api/shops/:shopId/waiters/:waiterId
// @access  Private (Shopkeeper who owns the shop)
const updateWaiter = async (req, res) => {
  try {
    const { shopId, waiterId } = req.params;
    const { name, email, isActive } = req.body;

    const shop = await findShop(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    if (shop.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const waiter = await User.findById(waiterId);
    if (!waiter || waiter.role !== 'waiter' || waiter.shopId.toString() !== shop._id.toString()) {
      return res.status(404).json({ message: 'Waiter not found' });
    }

    if (email && email.toLowerCase() !== waiter.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    if (name !== undefined) waiter.name = name;
    if (email !== undefined) waiter.email = email;
    if (isActive !== undefined) waiter.isActive = isActive;

    await waiter.save();

    res.json({
      success: true,
      data: {
        id: waiter._id,
        name: waiter.name,
        email: waiter.email,
        isActive: waiter.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete waiter account
// @route   DELETE /api/shops/:shopId/waiters/:waiterId
// @access  Private (Shopkeeper who owns the shop)
const deleteWaiter = async (req, res) => {
  try {
    const { shopId, waiterId } = req.params;

    const shop = await findShop(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    if (shop.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const waiter = await User.findById(waiterId);
    if (!waiter || waiter.role !== 'waiter' || waiter.shopId.toString() !== shop._id.toString()) {
      return res.status(404).json({ message: 'Waiter not found' });
    }

    await User.findByIdAndDelete(waiterId);

    res.json({ success: true, message: 'Waiter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createWaiter, getShopWaiters, updateWaiter, deleteWaiter };