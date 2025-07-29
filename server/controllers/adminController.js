    // D:/server/controllers/adminController.js
    const userModel = require('../models/userModel');
    const bookingModel = require('../models/bookingModel'); // Might need this for future admin features

    const getAllUsers = async (req, res, next) => {
        try {
            const users = await userModel.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    };

    // You can add more admin-specific controller functions here later, e.g.,
    // const updateBookingStatus = async (req, res, next) => { ... };
    // const getDashboardStats = async (req, res, next) => { ... };

    module.exports = { getAllUsers };
    