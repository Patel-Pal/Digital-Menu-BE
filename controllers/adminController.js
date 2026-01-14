const User = require('../models/User');
const Shop = require('../models/Shop');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const DailyAnalytics = require('../models/DailyAnalytics');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalShops = await Shop.countDocuments();
    const activeShops = await Shop.countDocuments({ isActive: true });
    const totalScans = await Shop.aggregate([
      { $group: { _id: null, total: { $sum: '$qrScans' } } }
    ]);
    const totalViews = await Shop.aggregate([
      { $group: { _id: null, total: { $sum: '$menuViews' } } }
    ]);
    const totalMenuItems = await MenuItem.countDocuments();
    const totalCategories = await Category.countDocuments();

    // Get subscription distribution
    const subscriptionStats = await Shop.aggregate([
      { $group: { _id: '$subscription', count: { $sum: 1 } } }
    ]);

    // Get recent shops (last 7 days)
    const recentShops = await Shop.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('ownerId', 'name email');

    res.json({
      success: true,
      data: {
        totalUsers,
        totalShops,
        activeShops,
        totalScans: totalScans[0]?.total || 0,
        totalViews: totalViews[0]?.total || 0,
        totalMenuItems,
        totalCategories,
        subscriptionStats,
        recentShops
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('shopId', 'name');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all shops with filters
// @route   GET /api/admin/shops
// @access  Private (Admin)
const getAllShops = async (req, res) => {
  try {
    const { search, status, subscription, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.isActive = status === 'active';
    }
    
    if (subscription) {
      query.subscription = subscription;
    }

    const shops = await Shop.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Shop.countDocuments(query);

    res.json({
      success: true,
      data: shops,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update shop status
// @route   PUT /api/admin/shops/:id/status
// @access  Private (Admin)
const updateShopStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).populate('ownerId', 'name email');
    
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }
    
    res.json({ success: true, data: shop });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete shop
// @route   DELETE /api/admin/shops/:id
// @access  Private (Admin)
const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // Delete related data
    await Category.deleteMany({ shopId: req.params.id });
    await MenuItem.deleteMany({ shopId: req.params.id });
    await DailyAnalytics.deleteMany({ shopId: req.params.id });
    await Shop.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Shop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analytics data
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getAnalytics = async (req, res) => {
  try {
    const { period = '7' } = req.query;
    const days = parseInt(period);
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Get daily analytics for the period
    const dailyData = await DailyAnalytics.aggregate([
      {
        $match: {
          date: {
            $gte: startDate.toISOString().split('T')[0],
            $lte: endDate.toISOString().split('T')[0]
          }
        }
      },
      {
        $group: {
          _id: '$date',
          totalScans: { $sum: '$scans' },
          totalViews: { $sum: '$views' },
          uniqueVisitors: { $sum: '$uniqueVisitors' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get top performing shops
    const topShops = await Shop.find({ isActive: true })
      .sort({ qrScans: -1 })
      .limit(10)
      .populate('ownerId', 'name');

    res.json({
      success: true,
      data: {
        dailyData,
        topShops
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get subscription analytics
// @route   GET /api/admin/subscriptions
// @access  Private (Admin)
const getSubscriptions = async (req, res) => {
  try {
    // Get subscription distribution
    const distribution = await Shop.aggregate([
      { $group: { _id: '$subscription', count: { $sum: 1 } } }
    ]);

    // Get shops with subscription details
    const subscriptions = await Shop.find()
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 });

    // Calculate revenue (mock calculation)
    const revenue = subscriptions.reduce((total, shop) => {
      const prices = { free: 0, basic: 9.99, premium: 24.99, enterprise: 49.99 };
      return total + (prices[shop.subscription] || 0);
    }, 0);

    res.json({
      success: true,
      data: {
        distribution,
        subscriptions,
        monthlyRevenue: revenue,
        activeSubscriptions: subscriptions.filter(s => s.subscription !== 'free').length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getDashboardStats, 
  getAllUsers, 
  updateUserStatus,
  getAllShops,
  updateShopStatus,
  deleteShop,
  getAnalytics,
  getSubscriptions
};
