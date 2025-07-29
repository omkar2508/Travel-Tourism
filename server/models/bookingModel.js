    // D:/server/models/bookingModel.js
    const pool = require('../config/db');

    const createBooking = async (userId, placeId, status) => {
        // booking_date defaults to CURRENT_TIMESTAMP in DB, so no need to pass it here
        const [result] = await pool.query(
            'INSERT INTO bookings (user_id, place_id, status) VALUES (?, ?, ?)',
            [userId, placeId, status]
        );
        return result.insertId;
    };

    const getUserBookings = async (userId) => {
        const query = `
            SELECT b.id as booking_id, p.name AS place_name, p.price, b.booking_date, b.status
            FROM bookings b
            JOIN places p ON b.place_id = p.id
            WHERE b.user_id = ?
            ORDER BY b.booking_date DESC`;
        const [rows] = await pool.query(query, [userId]);
        return rows;
    };

    const getAllBookings = async () => {
        const query = `
            SELECT b.id as booking_id, u.name AS user_name, u.email AS user_email,
                   p.name AS place_name, p.price, b.booking_date, b.status
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN places p ON b.place_id = p.id
            ORDER BY b.booking_date DESC`;
        const [rows] = await pool.query(query);
        return rows;
    };

    module.exports = { createBooking, getUserBookings, getAllBookings };
    