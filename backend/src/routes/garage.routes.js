const router = require('express').Router();
const garageController = require('../controllers/garage.controller');
const { authenticate, isAdmin, isGarageOwner } = require('../middleware/auth.middleware');

// Public routes
// Get all garages (with filters)
router.get('/', garageController.getAllGarages);

// Protected routes
// Get user's garages with status filtering
router.get('/user/garages', authenticate, garageController.getUserGarages);

// Get garage by ID (requires authentication to check ownership)
router.get('/:id', authenticate, garageController.getGarageById);

// Debug endpoint - TEMPORARY
router.post('/:id/debug-activate', garageController.debugActivateGarage);

// Create new garage (requires authentication)
router.post('/', authenticate, garageController.createGarage);

// Update garage (requires authentication and ownership)
router.put('/:id', authenticate, isGarageOwner, garageController.updateGarage);

// Update garage status (admin or owner)
router.patch('/:id/status', authenticate, garageController.updateGarageStatus);

// Delete garage (requires authentication and ownership)
router.delete('/:id', authenticate, isGarageOwner, garageController.deleteGarage);

// Admin routes
// Toggle garage active status (admin only)
router.patch('/:id/toggle-active', authenticate, isAdmin, garageController.toggleGarageActive);

// Toggle garage verification status (admin only)
router.patch('/:id/toggle-verified', authenticate, isAdmin, garageController.toggleGarageVerified);

module.exports = router; 