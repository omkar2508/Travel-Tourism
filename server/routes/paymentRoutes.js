// D:/server/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/createOrder', isAuthenticated, paymentController.createOrder);

module.exports = router;