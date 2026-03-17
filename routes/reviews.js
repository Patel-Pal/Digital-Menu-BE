const express = require('express');
const router = express.Router();
const { submitReview, getReviews, checkReview, deleteReview } = require('../controllers/reviewController');
const { auth, authorize } = require('../middleware/auth');

router.post('/:shopId', submitReview);
router.get('/:shopId', getReviews);
router.get('/:shopId/check/:deviceId', checkReview);
router.delete('/:reviewId', auth, authorize('shopkeeper', 'admin'), deleteReview);

module.exports = router;
