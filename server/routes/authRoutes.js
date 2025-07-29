// D:/server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout); // Logout is typically a POST for consistency in APIs
router.get('/isLoggedIn', isAuthenticated, authController.checkLoginStatus); // Protected route to check login status

module.exports = router;