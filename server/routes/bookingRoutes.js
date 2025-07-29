
// D:/server/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

router.post('/', isAuthenticated, bookingController.bookPlace); // Book a place (Authenticated user)
router.get('/user', isAuthenticated, bookingController.getUserBookings); // Get user's bookings (Authenticated user)
router.get('/admin', isAuthenticated, isAdmin, bookingController.getAllBookings); // Get all bookings (Admin only)

module.exports = router;