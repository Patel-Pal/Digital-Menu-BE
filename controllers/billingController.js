const Bill = require('../models/Bill');
const Order = require('../models/Order');

// Generate bill for customer
exports.generateBill = async (req, res) => {
  try {
    const { customerName, deviceId, shopId, tableNumber, paymentMethod = 'cash' } = req.body;

    // Find all unbilled orders for this customer (any status except rejected)
    // Try with both customerName and deviceId, then fallback to just deviceId
    let unbilledOrders = await Order.find({
      customerName,
      deviceId,
      shopId,
      status: { $ne: 'rejected' }, // Any status except rejected
      $or: [
        { billingStatus: 'unbilled' },
        { billingStatus: { $exists: false } } // For existing orders without billingStatus
      ]
    }).populate('items.menuItemId');

    // If no orders found with exact customer name, try with just deviceId and shopId
    if (unbilledOrders.length === 0) {
      unbilledOrders = await Order.find({
        deviceId,
        shopId,
        status: { $ne: 'rejected' },
        $or: [
          { billingStatus: 'unbilled' },
          { billingStatus: { $exists: false } }
        ]
      }).populate('items.menuItemId');
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
        const existingItem = consolidatedItems.find(
          ci => ci.menuItemId.toString() === item.menuItemId.toString()
        );
        
        if (existingItem) {
          existingItem.quantity += item.quantity;
          existingItem.totalPrice += item.price * item.quantity;
        } else {
          consolidatedItems.push({
            menuItemId: item.menuItemId,
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

    // Create bill
    const bill = new Bill({
      shopId,
      customerName,
      deviceId,
      tableNumber,
      orderIds,
      items: consolidatedItems,
      subtotal,
      taxAmount,
      totalAmount,
      paymentMethod
    });

    await bill.save();

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

    const filter = { shopId };
    if (status) filter.paymentStatus = status;

    const bills = await Bill.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Bill.countDocuments(filter);

    res.json({
      success: true,
      data: bills,
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

// Debug endpoint to check orders
exports.debugOrders = async (req, res) => {
  try {
    const { deviceId, shopId } = req.query;
    
    const orders = await Order.find({
      deviceId,
      shopId
    }).select('customerName deviceId status billingStatus createdAt items');

    res.json({
      success: true,
      data: orders,
      count: orders.length
    });
  } catch (error) {
    console.error('Debug orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch orders', 
      error: error.message 
    });
  }
};
