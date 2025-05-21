const router = require('express').Router();
const userController = require('../controllers/user.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// Get all users (admin only)
router.get('/', authenticate, isAdmin, userController.getAllUsers);

// Get user by ID
router.get('/:id', authenticate, userController.getUserById);

// Update user
router.put('/:id', authenticate, userController.updateUser);

// Delete user
router.delete('/:id', authenticate, userController.deleteUser);

// Get user's garages
router.get('/:id/garages', authenticate, userController.getUserGarages);

// Get user's reviews
router.get('/:id/reviews', authenticate, userController.getUserReviews);

module.exports = router; 