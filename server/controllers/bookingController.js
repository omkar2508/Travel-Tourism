// D:/server/controllers/bookingController.js
const bookingModel = require('../models/bookingModel');
const { sendBookingConfirmationEmail } = require('../utils/emailUtils');
const userModel = require('../models/userModel'); // To get user email/name for email

const bookPlace = async (req, res, next) => {
    try {
        const { place_id } = req.body;
        const userId = req.user.id; // User ID from JWT payload
        const userEmail = req.user.email; // User email from JWT payload
        const userName = req.user.name; // User name from JWT payload (might need to fetch from DB if not in token)

        if (!place_id) {
            return res.status(400).json({ message: "Place ID is required." });
        }

        const bookingId = await bookingModel.createBooking(userId, place_id, 'Confirmed');

        // Send confirmation email
        // Fetch full user details if 'name' is not included in JWT payload
        const userDetails = await userModel.findUserById(userId);
        if (userDetails) {
            await sendBookingConfirmationEmail(userDetails.email, userDetails.name, place_id);
        }


        res.status(201).json({ message: "Booking confirmed and email sent!", bookingId });
    } catch (error) {
        next(error);
    }
};

const getUserBookings = async (req, res, next) => {
    try {
        const userId = req.user.id; // User ID from JWT payload
        const bookings = await bookingModel.getUserBookings(userId);
        res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
};

const getAllBookings = async (req, res, next) => { // Admin only
    try {
        const bookings = await bookingModel.getAllBookings();
        res.status(200).json(bookings);
    } catch (error) {
        next(error);
    }
};

module.exports = { bookPlace, getUserBookings, getAllBookings };