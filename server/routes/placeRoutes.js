// D:/server/routes/placeRoutes.js
const express = require('express');
const router = express.Router();
const placesController = require('../controllers/placesController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

// GET /api/places - Get all places (accessible to authenticated users)
// Now accepts a query parameter to filter by availability
router.get('/', isAuthenticated, placesController.getAllPlaces);
router.post('/', isAuthenticated, isAdmin, placesController.addPlace); // Add place (Admin only)
router.delete('/:id', isAuthenticated, isAdmin, placesController.removePlace); // Remove place (Admin only)

// NEW: PATCH /api/places/:id/availability - Toggle place availability (Admin only)
router.patch('/:id/availability', isAuthenticated, isAdmin, placesController.togglePlaceAvailability);

module.exports = router;
