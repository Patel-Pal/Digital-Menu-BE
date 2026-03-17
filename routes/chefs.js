const express = require('express');
const router = express.Router();
const { createChef, getShopChefs, updateChef, deleteChef } = require('../controllers/chefController');
const { auth, authorize } = require('../middleware/auth');

// All routes require auth + shopkeeper authorization
router.post('/shops/:shopId/chefs', auth, authorize('shopkeeper'), createChef);
router.get('/shops/:shopId/chefs', auth, authorize('shopkeeper'), getShopChefs);
router.put('/shops/:shopId/chefs/:chefId', auth, authorize('shopkeeper'), updateChef);
router.delete('/shops/:shopId/chefs/:chefId', auth, authorize('shopkeeper'), deleteChef);

module.exports = router;
