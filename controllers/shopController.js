const Shop = require('../models/Shop');

// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
const getShops = async (req, res) => {
  try {
    const shops = await Shop.find({ isActive: true }).populate('ownerId', 'name email');
    res.json({ success: true, data: shops });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single shop
// @route   GET /api/shops/:id
// @access  Public
const getShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.params.id }).populate('ownerId', 'name email');
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    res.json({ success: true, data: shop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create shop
// @route   POST /api/shops
// @access  Private (Shopkeeper)
const createShop = async (req, res) => {
  try {
    const shopData = { ...req.body, ownerId: req.user._id };
    const shop = await Shop.create(shopData);
    res.status(201).json({ success: true, data: shop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update shop
// @route   PUT /api/shops/:id
// @access  Private (Owner/Admin)
const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    if (shop.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedShop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updatedShop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete shop
// @route   DELETE /api/shops/:id
// @access  Private (Owner/Admin)
const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    if (shop.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Shop.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Shop deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get shop profile by user ID
// @route   GET /api/shops/profile
// @access  Private
const getShopProfile = async (req, res) => {
  try {
    const shop = await Shop.findOne({ ownerId: req.user._id });
    
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    
    res.json({ success: true, data: shop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update shop profile
// @route   POST /api/shops/profile
// @access  Private
const createOrUpdateShopProfile = async (req, res) => {
  try {
    const { description, logo, banner, address, phone } = req.body;
    const ownerId = req.user._id;
    
    // Use user's name and email from the logged-in user
    const name = req.user.name;
    const email = req.user.email;
    
    let shop = await Shop.findOne({ ownerId });
    
    if (shop) {
      // Update existing shop
      shop = await Shop.findByIdAndUpdate(
        shop._id,
        { name, description, logo, banner, address, phone, email },
        { new: true, runValidators: true }
      );
    } else {
      // Create new shop
      shop = await Shop.create({
        name,
        description,
        logo,
        banner,
        address,
        phone,
        email,
        ownerId
      });
    }
    
    res.json({ success: true, data: shop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getShops, getShop, createShop, updateShop, deleteShop, getShopProfile, createOrUpdateShopProfile };
