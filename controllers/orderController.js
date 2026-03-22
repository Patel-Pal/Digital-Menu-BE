const mongoose = require('mongoose');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { customerName, tableNumber, orderNotes, items } = req.body;
    let { shopId, deviceId } = req.body;

    // If authenticated waiter, use waiter's shopId and set waiterId
    const isWaiter = req.user && req.user.role === 'waiter';
    if (isWaiter) {
      shopId = req.user.shopId;
      deviceId = 'waiter_' + req.user._id;
    }

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({ message: `Menu item ${item.menuItemId} not found` });
      }
      
      const orderItem = {
        menuItemId: item.menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity || 1
      };
      
      totalAmount += menuItem.price * orderItem.quantity;
      orderItems.push(orderItem);
    }

    const order = new Order({
      shopId,
      customerName,
      tableNumber,
      orderNotes,
      deviceId,
      items: orderItems,
      totalAmount,
      ...(isWaiter && { waiterId: req.user._id })
    });

    await order.save();
    await order.populate('items.menuItemId');

    // WebSocket notification to shop
    if (global.io) {
      global.io.to(`shop_${shopId}`).emit('new_order', {
        orderId: order._id,
        customerName: order.customerName,
        tableNumber: order.tableNumber,
        totalAmount: order.totalAmount,
        items: order.items,
        createdAt: order.createdAt
      });
    }

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order placed successfully'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

// Get orders for a shop with counts
exports.getShopOrders = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { status, page = 1, limit = 20, waiterId } = req.query;

    // Resolve both possible shopId values (ownerId and shop._id)
    // Orders from customers use ownerId as shopId, waiter orders use shop._id
    const Shop = require('../models/Shop');
    const shopIds = [shopId];
    
    // If shopId is an ownerId, also include the actual shop._id
    const shopByOwner = await Shop.findOne({ ownerId: shopId }).catch(() => null);
    if (shopByOwner) {
      shopIds.push(shopByOwner._id.toString());
    }
    
    // If shopId is a shop._id, also include the ownerId
    const shopById = await Shop.findById(shopId).catch(() => null);
    if (shopById && shopById.ownerId) {
      shopIds.push(shopById.ownerId.toString());
    }

    // Deduplicate
    const uniqueShopIds = [...new Set(shopIds)].map(id => new mongoose.Types.ObjectId(id));

    // Build match condition for aggregation
    const matchCondition = { shopId: { $in: uniqueShopIds } };
    if (waiterId) matchCondition.waiterId = new mongoose.Types.ObjectId(waiterId);

    // Use aggregation to get counts efficiently in a single query
    const countsPromise = Order.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get filtered orders for current tab
    const filter = { shopId: { $in: uniqueShopIds } };
    if (waiterId) filter.waiterId = waiterId;
    if (status && status !== 'all') filter.status = status;

    const ordersPromise = Order.find(filter)
      .populate('items.menuItemId')
      .populate('waiterId', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * parseInt(limit));

    const totalPromise = Order.countDocuments(filter);

    // Execute all queries in parallel
    const [countsResult, orders, total] = await Promise.all([
      countsPromise,
      ordersPromise,
      totalPromise
    ]);

    // Transform counts result into object
    const counts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      completed: 0,
      all: 0
    };

    countsResult.forEach(item => {
      counts[item._id] = item.count;
      counts.all += item.count;
    });

    res.json({
      success: true,
      data: orders,
      counts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get shop orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, estimatedReadyTime, rejectionReason } = req.body;

    // If waiter, only allow setting status to 'completed' on 'approved' orders
    if (req.user && req.user.role === 'waiter') {
      if (status !== 'completed') {
        return res.status(400).json({ message: 'Waiters can only mark orders as completed' });
      }
      const existingOrder = await Order.findById(orderId);
      if (!existingOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      if (existingOrder.status !== 'approved') {
        return res.status(400).json({ message: 'Only approved orders can be marked as completed' });
      }
    }

    const updateData = { status };
    
    if (status === 'approved' && estimatedReadyTime) {
      updateData.estimatedReadyTime = estimatedReadyTime;
    }
    
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    ).populate('items.menuItemId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Emit WebSocket event for order status update
    if (global.io) {
      const statusPayload = {
        orderId: order._id,
        status: order.status,
        tableNumber: order.tableNumber,
        customerName: order.customerName,
        totalAmount: order.totalAmount,
        estimatedReadyTime: order.estimatedReadyTime,
        rejectionReason: order.rejectionReason,
        updatedAt: order.updatedAt
      };

      // Notify shop dashboard
      global.io.to(`shop_${order.shopId}`).emit('order_status_updated', statusPayload);

      // Notify customer so their pending orders update in real time
      if (order.deviceId) {
        global.io.to(`customer_${order.deviceId}`).emit('order_status_updated', statusPayload);
      }
    }

    res.json({
      success: true,
      data: order,
      message: `Order ${status} successfully`
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

// Get customer orders by device ID
exports.getCustomerOrders = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { shopId } = req.query;

    const filter = { deviceId };
    if (shopId) filter.shopId = shopId;

    const orders = await Order.find(filter)
      .populate('items.menuItemId')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get customer orders error:', error);
    res.status(500).json({ message: 'Failed to fetch customer orders', error: error.message });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('items.menuItemId')
      .populate('shopId', 'name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};

// Get table aggregation for a shop
exports.getTableAggregation = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { showAll } = req.query;

    // Resolve both possible shopId values (ownerId and shop._id)
    // Same pattern as getShopOrders
    const Shop = require('../models/Shop');
    const shopIds = [shopId];

    const shopByOwner = await Shop.findOne({ ownerId: shopId }).catch(() => null);
    if (shopByOwner) {
      shopIds.push(shopByOwner._id.toString());
    }

    const shopById = await Shop.findById(shopId).catch(() => null);
    if (shopById && shopById.ownerId) {
      shopIds.push(shopById.ownerId.toString());
    }

    const uniqueShopIds = [...new Set(shopIds)].map(id => new mongoose.Types.ObjectId(id));

    const statusFilter = showAll === 'true' ? {} : { status: { $in: ['pending', 'approved'] } };

    const pipeline = [
      // 1. Match orders for this shop (only active statuses unless showAll)
      { $match: { shopId: { $in: uniqueShopIds }, ...statusFilter } },

      // 2. Sort by createdAt descending (newest first within each group)
      { $sort: { createdAt: -1 } },

      // 3. Group by tableNumber
      {
        $group: {
          _id: '$tableNumber',
          customerName: { $first: '$customerName' },
          orders: { $push: '$$ROOT' },
          totalAmount: { $sum: '$totalAmount' },
          firstOrderTime: { $min: '$createdAt' },
          statuses: { $push: '$status' },
          billingStatuses: { $push: '$billingStatus' }
        }
      },

      // 4. Lookup associated bills
      {
        $lookup: {
          from: 'bills',
          let: { tableNum: '$_id', shopIds: uniqueShopIds },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$tableNumber', '$$tableNum'] },
                    { $in: ['$shopId', '$$shopIds'] }
                  ]
                }
              }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 }
          ],
          as: 'bills'
        }
      },

      // 5. Reshape output
      {
        $project: {
          _id: 0,
          tableNumber: '$_id',
          customerName: 1,
          orders: 1,
          totalAmount: 1,
          firstOrderTime: 1,
          bill: { $arrayElemAt: ['$bills', 0] },
          statuses: 1,
          billingStatuses: 1
        }
      }
    ];

    let tables = await Order.aggregate(pipeline);

    // Remove internal fields from response
    tables = tables.map(({ statuses, billingStatuses, ...rest }) => rest);

    res.status(200).json({
      success: true,
      data: tables
    });
  } catch (error) {
    console.error('Get table aggregation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch table data',
      error: error.message
    });
  }
};
