const express = require('express');
const { getDashboardStats, getAllUsers, updateUserStatus } = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', auth, authorize('admin'), getDashboardStats);
router.get('/users', auth, authorize('admin'), getAllUsers);
router.put('/users/:id/status', auth, authorize('admin'), updateUserStatus);

module.exports = router;
