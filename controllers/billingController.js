const mongoose = require('mongoose');
const Bill = require('../models/Bill');
const Order = require('../models/Order');

// Generate bill for customer or waiter
exports.generateBill = async (req, res) => {
  try {
    const { customerName, deviceId, shopId, tableNumber } = req.body;

    let unbilledOrders;
    const isWaiter = req.user && req.user.role === 'waiter';

    if (isWaiter) {
      // Waiter flow: find all unbilled completed orders for the table, regardless of deviceId
      unbilledOrders = await Order.find({
        shopId,
        tableNumber,
        status: 'completed',
        $or: [
          { billingStatus: 'unbilled' },
          { billingStatus: { $exists: false } }
        ]
      }).populate('items.menuItemId');
    } else {
      // Customer flow: find unbilled orders by customerName + deviceId + shopId
      unbilledOrders = await Order.find({
        customerName,
        deviceId,
        shopId,
        status: { $ne: 'rejected' },
        $or: [
          { billingStatus: 'unbilled' },
          { billingStatus: { $exists: false } }
        ]
      });

      // Fallback to just deviceId and shopId
      if (unbilledOrders.length === 0) {
        unbilledOrders = await Order.find({
          deviceId,
          shopId,
          status: { $ne: 'rejected' },
          $or: [
            { billingStatus: 'unbilled' },
            { billingStatus: { $exists: false } }
          ]
        });
      }
    }

    if (unbilledOrders.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No unbilled orders found for this customer' 
      });
    }

    // Consolidate all items from all orders
    const consolidatedItems = [];
    const orderIds = [];
    let subtotal = 0;

    unbilledOrders.forEach(order => {
      orderIds.push(order._id);
      order.items.forEach(item => {
        const itemKey = item.menuItemId ? item.menuItemId.toString() : item.name;
        const existingItem = consolidatedItems.find(
          ci => {
            const ciKey = ci.menuItemId ? ci.menuItemId.toString() : ci.name;
            return ciKey === itemKey;
          }
        );
        
        if (existingItem) {
          existingItem.quantity += item.quantity;
          existingItem.totalPrice += item.price * item.quantity;
        } else {
          consolidatedItems.push({
            menuItemId: item.menuItemId || undefined,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            totalPrice: item.price * item.quantity
          });
        }
        subtotal += item.price * item.quantity;
      });
    });

    // Calculate tax (assuming 5% GST)
    const taxRate = 0.05;
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    // For waiter-initiated bills, derive customerName and deviceId from orders
    const billCustomerName = isWaiter
      ? (customerName || unbilledOrders[0].customerName)
      : customerName;
    const billDeviceId = isWaiter
      ? `waiter_${req.user._id}`
      : deviceId;

    // Create bill
    const bill = new Bill({
      shopId,
      customerName: billCustomerName,
      deviceId: billDeviceId,
      tableNumber,
      orderIds,
      items: consolidatedItems,
      subtotal,
      taxAmount,
      totalAmount,
      paymentMethod: 'cash',
      paymentStatus: 'pending'
    });

    await bill.save();

    // WebSocket notifications
    if (global.io) {
      // Notify customer (only for customer-initiated bills)
      if (!isWaiter && deviceId) {
        global.io.to(`customer_${deviceId}`).emit('bill_generated', {
          billId: bill._id,
          totalAmount: bill.totalAmount,
          items: bill.items,
          customerName: bill.customerName,
          tableNumber: bill.tableNumber
        });
      }
      
      // Notify shop
      global.io.to(`shop_${shopId}`).emit('bill_generated', {
        billId: bill._id,
        customerName: bill.customerName,
        tableNumber: bill.tableNumber,
        totalAmount: bill.totalAmount,
        paymentStatus: bill.paymentStatus
      });
    }

    // Update orders to mark as billed
    await Order.updateMany(
      { _id: { $in: orderIds } },
      { 
        billingStatus: 'billed',
        billId: bill._id
      }
    );

    await bill.populate('shopId', 'name');

    res.status(201).json({
      success: true,
      data: bill,
      message: 'Bill generated successfully'
    });
  } catch (error) {
    console.error('Generate bill error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate bill', 
      error: error.message 
    });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { billId } = req.params;
    const { paymentStatus, paymentMethod } = req.body;

    const bill = await Bill.findByIdAndUpdate(
      billId,
      { 
        paymentStatus,
        paymentMethod,
        paidAt: paymentStatus === 'paid' ? new Date() : null
      },
      { new: true }
    );

    if (!bill) {
      return res.status(404).json({ 
        success: false, 
        message: 'Bill not found' 
      });
    }
    // WebSocket notification to shopkeeper when payment is received
    if (global.io && paymentStatus === 'paid') {
      global.io.to(`shop_${bill.shopId}`).emit('payment_received', {
        billId: bill._id,
        customerName: bill.customerName,
        amount: bill.totalAmount,
        paymentMethod: bill.paymentMethod,
        tableNumber: bill.tableNumber
      });

      // Also notify customer about payment confirmation
      global.io.to(`customer_${bill.deviceId}`).emit('payment_received', {
        billId: bill._id,
        amount: bill.totalAmount,
        paymentMethod: bill.paymentMethod
      });
    }
    res.json({
      success: true,
      data: bill,
      message: `Payment status updated to ${paymentStatus}`
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update payment status', 
      error: error.message 
    });
  }
};

// Get customer bills
exports.getCustomerBills = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { shopId } = req.query;

    const filter = { deviceId };
    if (shopId) filter.shopId = shopId;

    const bills = await Bill.find(filter)
      .populate('shopId', 'name')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      data: bills
    });
  } catch (error) {
    console.error('Get customer bills error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch customer bills', 
      error: error.message 
    });
  }
};

// Get shop bills
exports.getShopBills = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    // Resolve both possible shopId values (ownerId and shop._id)
    const Shop = require('../models/Shop');
    const shopIds = [shopId];
    
    const shopByOwner = await Shop.findOne({ ownerId: shopId }).catch(() => null);
    if (shopByOwner) shopIds.push(shopByOwner._id.toString());
    
    const shopById = await Shop.findById(shopId).catch(() => null);
    if (shopById && shopById.ownerId) shopIds.push(shopById.ownerId.toString());

    const uniqueShopIds = [...new Set(shopIds)].map(id => new mongoose.Types.ObjectId(id));

    const filter = { shopId: { $in: uniqueShopIds } };
    if (status) filter.paymentStatus = status;

    // Get counts by payment status
    const countsPromise = Bill.aggregate([
      { $match: { shopId: { $in: uniqueShopIds } } },
      { $group: { _id: '$paymentStatus', count: { $sum: 1 } } }
    ]);

    const bills = await Bill.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Bill.countDocuments(filter);

    const countsResult = await countsPromise;
    const counts = { pending: 0, paid: 0, failed: 0, all: 0 };
    countsResult.forEach(item => {
      counts[item._id] = item.count;
      counts.all += item.count;
    });

    res.json({
      success: true,
      data: bills,
      counts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get shop bills error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch shop bills', 
      error: error.message 
    });
  }
};

// Get single bill
exports.getBill = async (req, res) => {
  try {
    const { billId } = req.params;

    const bill = await Bill.findById(billId)
      .populate('shopId', 'name address phone')
      .populate('orderIds');

    if (!bill) {
      return res.status(404).json({ 
        success: false, 
        message: 'Bill not found' 
      });
    }

    res.json({
      success: true,
      data: bill
    });
  } catch (error) {
    console.error('Get bill error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch bill', 
      error: error.message 
    });
  }
};

// Get billing analytics for shop
exports.getBillingAnalytics = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { period = 'daily', days = 30 } = req.query;

    // Resolve both possible shopId values
    const Shop = require('../models/Shop');
    const shopIds = [shopId];
    
    const shopByOwner = await Shop.findOne({ ownerId: shopId }).catch(() => null);
    if (shopByOwner) shopIds.push(shopByOwner._id.toString());
    
    const shopById = await Shop.findById(shopId).catch(() => null);
    if (shopById && shopById.ownerId) shopIds.push(shopById.ownerId.toString());

    const uniqueShopIds = [...new Set(shopIds)];

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(days));

    // Get all bills for the period
    const bills = await Bill.find({
      shopId: { $in: uniqueShopIds },
      createdAt: { $gte: startDate, $lte: endDate }
    }).sort({ createdAt: 1 });

    // Calculate totals
    const totalRevenue = bills.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalAmount, 0);
    const totalBills = bills.length;
    const paidBills = bills.filter(b => b.paymentStatus === 'paid').length;
    const pendingBills = bills.filter(b => b.paymentStatus === 'pending').length;
    const avgBillAmount = paidBills > 0 ? totalRevenue / paidBills : 0;

    // Group data by period
    const groupedData = {};
    bills.forEach(bill => {
      let key;
      const date = new Date(bill.createdAt);
      
      if (period === 'daily') {
        key = date.toISOString().split('T')[0];
      } else if (period === 'weekly') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else if (period === 'monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!groupedData[key]) {
        groupedData[key] = {
          date: key,
          totalBills: 0,
          paidBills: 0,
          revenue: 0,
          avgAmount: 0
        };
      }

      groupedData[key].totalBills++;
      if (bill.paymentStatus === 'paid') {
        groupedData[key].paidBills++;
        groupedData[key].revenue += bill.totalAmount;
      }
    });

    // Calculate averages
    Object.keys(groupedData).forEach(key => {
      if (groupedData[key].paidBills > 0) {
        groupedData[key].avgAmount = groupedData[key].revenue / groupedData[key].paidBills;
      }
    });

    // Payment method breakdown
    const paymentMethods = {};
    bills.filter(b => b.paymentStatus === 'paid').forEach(bill => {
      paymentMethods[bill.paymentMethod] = (paymentMethods[bill.paymentMethod] || 0) + 1;
    });

    // Top selling items
    const itemStats = {};
    bills.forEach(bill => {
      bill.items.forEach(item => {
        if (!itemStats[item.name]) {
          itemStats[item.name] = { quantity: 0, revenue: 0 };
        }
        itemStats[item.name].quantity += item.quantity;
        itemStats[item.name].revenue += item.totalPrice;
      });
    });

    const topItems = Object.entries(itemStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalBills,
          paidBills,
          pendingBills,
          avgBillAmount,
          paymentRate: totalBills > 0 ? (paidBills / totalBills * 100).toFixed(1) : 0
        },
        chartData: Object.values(groupedData),
        paymentMethods,
        topItems,
        period,
        dateRange: { startDate, endDate }
      }
    });
  } catch (error) {
    console.error('Get billing analytics error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch billing analytics', 
      error: error.message 
    });
  }
};
