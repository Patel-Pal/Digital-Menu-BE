const express = require('express');
const router = express.Router();
const { createChef, getShopChefs, updateChef, deleteChef } = require('../controllers/chefController');
const { auth, authorize } = require('../middleware/auth');
const { requireFeature } = require('../middleware/featureGate');

// All routes require auth + shopkeeper authorization
router.post('/shops/:shopId/chefs', auth, authorize('shopkeeper'), requireFeature('chefs'), createChef);
router.get('/shops/:shopId/chefs', auth, authorize('shopkeeper'), requireFeature('chefs'), getShopChefs);
router.put('/shops/:shopId/chefs/:chefId', auth, authorize('shopkeeper'), requireFeature('chefs'), updateChef);
router.delete('/shops/:shopId/chefs/:chefId', auth, authorize('shopkeeper'), requireFeature('chefs'), deleteChef);

module.exports = router;
