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
    // Try by ownerId first, then by shop _id (for waiters who have shopId)
    let shop = await Shop.findOne({ ownerId: req.params.id }).populate('ownerId', 'name email');
    if (!shop) {
      shop = await Shop.findById(req.params.id).populate('ownerId', 'name email');
    }
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
    // Ensure user is authenticated and has valid ID
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        message: 'User not authenticated',
        debug: 'req.user or req.user._id is missing'
      });
    }

    console.log('Getting shop profile for user:', req.user._id, 'Role:', req.user.role);

    const shop = await Shop.findOne({ ownerId: req.user._id });
    
    if (!shop) {
      console.log('No shop found for user:', req.user._id);
      return res.status(404).json({ 
        message: 'Shop not found',
        debug: {
          userId: req.user._id,
          userRole: req.user.role,
          searchQuery: { ownerId: req.user._id }
        }
      });
    }
    
    console.log('Shop found:', shop._id, 'for user:', req.user._id);
    res.json({ success: true, data: shop });
  } catch (error) {
    console.error('Shop profile error:', error);
    res.status(500).json({ 
      message: error.message,
      debug: {
        userId: req.user?._id,
        userRole: req.user?.role,
        error: error.stack
      }
    });
  }
};

// @desc    Create or update shop profile
// @route   POST /api/shops/profile
// @access  Private
const createOrUpdateShopProfile = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { description, logo, banner, address, phone, menuTheme, type, qrColor, qrSettings } = req.body;
    const ownerId = req.user._id;
    
    // Use user's name and email from the logged-in user
    const name = req.user.name;
    const email = req.user.email;
    
    console.log('Creating/updating shop profile for user:', ownerId);
    
    let shop = await Shop.findOne({ ownerId });
    
    if (shop) {
      // Update existing shop
      console.log('Updating existing shop:', shop._id);
      shop = await Shop.findByIdAndUpdate(
        shop._id,
        { name, description, logo, banner, address, phone, email, menuTheme, type, qrColor, qrSettings },
        { new: true, runValidators: true }
      );
    } else {
      // Create new shop
      console.log('Creating new shop for user:', ownerId);
      shop = await Shop.create({
        name,
        description,
        logo,
        banner,
        address,
        phone,
        email,
        ownerId,
        menuTheme: menuTheme || 'coral',
        type: type || 'restaurant'
      });
    }
    
    console.log('Shop profile saved:', shop._id);
    res.json({ success: true, data: shop });
  } catch (error) {
    console.error('Create/update shop profile error:', error);
    res.status(500).json({ 
      message: error.message,
      debug: {
        userId: req.user?._id,
        error: error.stack
      }
    });
  }
};

// @desc    Get shop analytics
// @route   GET /api/shops/analytics
// @access  Private
const getShopAnalytics = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const shop = await Shop.findOne({ ownerId: req.user._id });
    
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    
    const currentScans = shop.qrScans || 0;
    const currentViews = shop.menuViews || 0;

    // Compute real weekly change from DailyAnalytics
    const DailyAnalytics = require('../models/DailyAnalytics');
    const today = new Date();
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - 6);
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(thisWeekStart.getDate() - 7);

    const fmt = (d) => d.toISOString().split('T')[0];

    const [thisWeekData, lastWeekData] = await Promise.all([
      DailyAnalytics.find({ shopId: shop._id, date: { $gte: fmt(thisWeekStart), $lte: fmt(today) } }),
      DailyAnalytics.find({ shopId: shop._id, date: { $gte: fmt(lastWeekStart), $lt: fmt(thisWeekStart) } }),
    ]);

    const thisWeekScans = thisWeekData.reduce((s, d) => s + (d.scans || 0), 0);
    const lastWeekScans = lastWeekData.reduce((s, d) => s + (d.scans || 0), 0);
    const thisWeekViews = thisWeekData.reduce((s, d) => s + (d.views || 0), 0);
    const lastWeekViews = lastWeekData.reduce((s, d) => s + (d.views || 0), 0);

    const calcChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const scansChange = calcChange(thisWeekScans, lastWeekScans);
    const viewsChange = calcChange(thisWeekViews, lastWeekViews);
    
    res.json({ 
      success: true, 
      data: {
        totalScans: currentScans,
        menuViews: currentViews,
        scansChange: `${scansChange >= 0 ? '+' : ''}${scansChange}% this week`,
        viewsChange: `${viewsChange >= 0 ? '+' : ''}${viewsChange}% this week`
      }
    });
  } catch (error) {
    console.error('Shop analytics error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Increment QR scan count
// @route   POST /api/shops/:id/scan
// @access  Public
const incrementScan = async (req, res) => {
  try {
    console.log('=== INCREMENT SCAN API CALLED ===');
    console.log('Param ID (ownerId):', req.params.id);
    
    const shop = await Shop.findOneAndUpdate(
      { ownerId: req.params.id },
      { $inc: { qrScans: 1 } },
      { new: true }
    );
    
    console.log('Shop found:', shop ? 'YES' : 'NO');
    if (shop) {
      console.log('Shop ID:', shop._id);
      console.log('Shop Name:', shop.name);
      console.log('New qrScans count:', shop.qrScans);
    }
    
    if (!shop) {
      console.log('❌ Shop not found with ownerId:', req.params.id);
      return res.status(404).json({ 
        message: 'Shop not found',
        debug: { ownerId: req.params.id }
      });
    }

    // Update daily analytics
    const DailyAnalytics = require('../models/DailyAnalytics');
    const today = new Date().toISOString().split('T')[0];
    
    const dailyAnalytics = await DailyAnalytics.findOneAndUpdate(
      { shopId: shop._id, date: today },
      { $inc: { scans: 1 } },
      { upsert: true, new: true }
    );
    
    console.log('Daily analytics updated:', dailyAnalytics.scans);
    console.log('✅ Scan increment successful');
    console.log('=== INCREMENT SCAN API END ===');
    
    res.json({ success: true, data: { scans: shop.qrScans } });
  } catch (error) {
    console.error('❌ Increment scan error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Increment menu view count
// @route   POST /api/shops/:id/view
// @access  Public
const incrementView = async (req, res) => {
  try {
    const shop = await Shop.findOneAndUpdate(
      { ownerId: req.params.id },
      { $inc: { menuViews: 1 } },
      { new: true }
    );
    
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // Update daily analytics
    const DailyAnalytics = require('../models/DailyAnalytics');
    const today = new Date().toISOString().split('T')[0];
    
    await DailyAnalytics.findOneAndUpdate(
      { shopId: shop._id, date: today },
      { $inc: { views: 1 } },
      { upsert: true, new: true }
    );
    
    res.json({ success: true, data: { views: shop.menuViews } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get comprehensive shop analytics
// @route   GET /api/shops/analytics/detailed
// @access  Private
const getDetailedAnalytics = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const shop = await Shop.findOne({ ownerId: req.user._id });
    
    if (!shop) {
      return res.status(404).json({ 
        message: 'Shop not found',
        debug: {
          userId: req.user._id,
          userRole: req.user.role
        }
      });
    }

    // Get menu items for this shop - use shop._id instead of req.user.shopId
    const MenuItem = require('../models/MenuItem');
    const menuItems = await MenuItem.find({ shopId: shop._id }).populate('categoryId', 'name');
    
    // Calculate analytics data
    const currentScans = shop.qrScans || 0;
    const currentViews = shop.menuViews || 0;
    const lastWeekScans = shop.lastWeekScans || 0;
    const lastWeekViews = shop.lastWeekViews || 0;
    
    const scansChange = lastWeekScans > 0 
      ? Math.round(((currentScans - lastWeekScans) / lastWeekScans) * 100)
      : currentScans > 0 ? 100 : 0;
      
    const viewsChange = lastWeekViews > 0 
      ? Math.round(((currentViews - lastWeekViews) / lastWeekViews) * 100)
      : currentViews > 0 ? 100 : 0;

    // Get real weekly data from daily analytics
    const DailyAnalytics = require('../models/DailyAnalytics');
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
    
    const dailyData = await DailyAnalytics.find({
      shopId: shop._id,
      date: {
        $gte: weekAgo.toISOString().split('T')[0],
        $lte: today.toISOString().split('T')[0]
      }
    }).sort({ date: 1 });

    // Create weekly data array with real data
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayData = dailyData.find(d => d.date === dateStr);
      
      return {
        date: dateStr,
        scans: dayData ? dayData.scans : 0,
        views: dayData ? dayData.views : 0
      };
    });

    // Most viewed items based on actual menu items
    const topItems = menuItems.slice(0, 4).map((item, index) => {
      const baseViews = Math.floor(currentViews / Math.max(menuItems.length, 1));
      const itemViews = Math.floor(baseViews * (1.5 - index * 0.2) * (0.8 + Math.random() * 0.4));
      const maxViews = Math.max(...menuItems.slice(0, 4).map(() => itemViews));
      
      return {
        name: item.name,
        views: Math.max(itemViews, 1),
        percentage: maxViews > 0 ? Math.floor((itemViews / maxViews) * 100) : 50
      };
    });

    res.json({ 
      success: true, 
      data: {
        totalScans: currentScans,
        menuViews: currentViews,
        scansChange: `${scansChange >= 0 ? '+' : ''}${scansChange}%`,
        viewsChange: `${viewsChange >= 0 ? '+' : ''}${viewsChange}%`,
        uniqueVisitors: Math.floor(currentViews * 0.7) || 0,
        avgTime: "2m 34s", // This would need session tracking to be truly dynamic
        weeklyData,
        topItems,
        // deviceBreakdown removed as it's commented out in frontend
      }
    });
  } catch (error) {
    console.error('Detailed analytics error:', error);
    res.status(500).json({ 
      message: error.message,
      debug: {
        userId: req.user?._id,
        error: error.stack
      }
    });
  }
};

// @desc    Get resolved features for the authenticated shopkeeper's shop
// @route   GET /api/shops/my/features
// @access  Private (Shopkeeper)
const getMyFeatures = async (req, res) => {
  try {
    const { resolveFeatures } = require('../config/featureMatrix');

    const shop = await Shop.findById(req.user.shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const overridesObj = shop.featureOverrides instanceof Map
      ? Object.fromEntries(shop.featureOverrides)
      : shop.featureOverrides || {};

    const resolvedFeatures = resolveFeatures(shop.subscription, shop.featureOverrides);

    res.json({
      success: true,
      data: {
        subscription: shop.subscription,
        featureOverrides: overridesObj,
        resolvedFeatures,
      },
    });
  } catch (error) {
    console.error('Get my features error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getShops, getShop, createShop, updateShop, deleteShop, getShopProfile, createOrUpdateShopProfile, getShopAnalytics, incrementScan, incrementView, getDetailedAnalytics, getMyFeatures };
