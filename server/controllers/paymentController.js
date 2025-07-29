// D:/server/controllers/paymentController.js
const Razorpay = require('razorpay');
require('dotenv').config({ path: '../.env' }); // Adjust path

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (req, res, next) => {
    try {
        const { amount } = req.body; // Amount in INR, from frontend
        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ message: 'Valid amount is required.' });
        }

        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `order_${Date.now()}`,
            payment_capture: 1 // auto capture payment
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        next(error);
    }
};

// You might also need a webhook endpoint for Razorpay to verify payments
// This is a more advanced topic and can be added later if needed for full payment flow.

module.exports = { createOrder };