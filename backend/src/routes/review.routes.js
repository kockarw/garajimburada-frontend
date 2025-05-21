const router = require('express').Router();
const reviewController = require('../controllers/review.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// Get all reviews for a garage
router.get('/garage/:garageId', reviewController.getGarageReviews);

// Create new review (requires authentication)
router.post('/garage/:garageId', authenticate, reviewController.createReview);

// Update review (requires authentication and ownership)
router.put('/:id', authenticate, reviewController.updateReview);

// Delete review (requires authentication and ownership)
router.delete('/:id', authenticate, reviewController.deleteReview);

// Toggle review verification (admin only)
router.patch('/:id/toggle-verified', authenticate, isAdmin, reviewController.toggleReviewVerified);

module.exports = router; 