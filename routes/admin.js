const express = require('express');
const { 
  getDashboardStats, 
  getAllUsers, 
  updateUserStatus,
  getAllShops,
  updateShopStatus,
  deleteShop,
  getAnalytics,
  getSubscriptions
} = require('../controllers/adminController');
const { 
  getContactInfo, 
  getAllContactInfo,
  createContact,
  updateContact,
  deleteContact,
  setActiveContact,
  createOrUpdateContact,
  submitContactForm
} = require('../controllers/contactController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Dashboard
router.get('/stats', auth, authorize('admin'), getDashboardStats);

// Users
router.get('/users', auth, authorize('admin'), getAllUsers);
router.put('/users/:id/status', auth, authorize('admin'), updateUserStatus);

// Shops
router.get('/shops', auth, authorize('admin'), getAllShops);
router.put('/shops/:id/status', auth, authorize('admin'), updateShopStatus);
router.delete('/shops/:id', auth, authorize('admin'), deleteShop);

// Analytics
router.get('/analytics', auth, authorize('admin'), getAnalytics);

// Subscriptions
router.get('/subscriptions', auth, authorize('admin'), getSubscriptions);

// Contact Info
router.get('/contact', getContactInfo);
router.post('/contact/submit', submitContactForm); // Public - contact form submission
router.get('/contact/all', auth, authorize('admin', 'shopkeeper'), getAllContactInfo);
router.post('/contact', auth, authorize('admin', 'shopkeeper'), createOrUpdateContact);
router.post('/contact/new', auth, authorize('admin', 'shopkeeper'), createContact);
router.put('/contact/:id', auth, authorize('admin', 'shopkeeper'), updateContact);
router.put('/contact/:id/activate', auth, authorize('admin', 'shopkeeper'), setActiveContact);
router.delete('/contact/:id', auth, authorize('admin', 'shopkeeper'), deleteContact);

module.exports = router;
