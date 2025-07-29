// D:/server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); // Ensure this path is correct
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware'); // Ensure this path is correct

// GET /api/admin/users - Get all users (Admin only)
router.get('/users', isAuthenticated, isAdmin, adminController.getAllUsers);

// You can add more admin routes here later, e.g.,
// router.put('/bookings/:id/status', isAuthenticated, isAdmin, adminController.updateBookingStatus);
// router.get('/stats', isAuthenticated, isAdmin, adminController.getDashboardStats);

module.exports = router;
