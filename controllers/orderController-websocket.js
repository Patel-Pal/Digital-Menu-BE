const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { shopId, customerName, tableNumber, orderNotes, deviceId, items } = req.body;

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
      totalAmount
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

// Get orders for a shop
exports.getShopOrders = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    const filter = { shopId };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('items.menuItemId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: orders,
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

    // WebSocket notification to customer
    if (global.io) {
      global.io.to(`customer_${order.deviceId}`).emit('order_status_updated', {
        orderId: order._id,
        status: order.status,
        estimatedReadyTime: order.estimatedReadyTime,
        rejectionReason: order.rejectionReason
      });
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
